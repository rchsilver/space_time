import { FastifyInstance } from "fastify";
import axios from "axios";
import { codeSchema, userSchema } from "../schemas/auth.schema";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request) => {
    const { code } = codeSchema.parse(request.body);

    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );
    const { access_token } = accessTokenResponse.data;

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userSchema.parse(userResponse.data);
    let user = await prisma.user.findUnique({
      where: {
        gitHubId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          gitHubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      });
    }
    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "30 days",
      }
    );
    console.log(token);
    return token;
  });
}

// export async function authRoutes(app: FastifyInstance) {
//   app.post("/register", async (request) => {
//     try {
//       const { code } = codeSchema.parse(request.body);
//       const acessTokenResponse = await axios.post(
//         "https://github.com/login/oauth/access_token",
//         null,
//         {
//           params: {
//             client_id: process.env.GITHUB_CLIENT_ID,
//             client_secret: process.env.GITHUB_CLIENT_SECRET,
//             code,
//           },
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       const { acess_token } = acessTokenResponse.data;

//       const userResponse = await axios.get("https://api.github.com/user", {
//         headers: {
//           Authorization: `Bearer ${acess_token}`,
//         },
//       });

//       const userInfo = userSchema.parse(userResponse.data);
//       let user = await prisma.user.findUnique({
//         where: {
//           gitHubId: userInfo.id,
//         },
//       });

//       if (!user) {
//         user = await prisma.user.create({
//           data: {
//             gitHubId: userInfo.id,
//             login: userInfo.login,
//             name: userInfo.name,
//             avatarUrl: userInfo.avatar_url,
//           },
//         });
//       }

//       const token = app.jwt.sign(
//         {
//           name: user.name,
//           avatarUrl: user.avatarUrl,
//         },
//         {
//           sub: user.id,
//           expiresIn: "30 days",
//         }
//       );

//       console.log(token);
//       return token;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   });
// }
