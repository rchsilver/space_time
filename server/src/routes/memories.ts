import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { paramsSchema, bodySchema } from "../schemas/memories.schema";

async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt: "asc",
      },
    });
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat("..."),
      };
    });
  });

  app.get("/memories/:id", async (request) => {
    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return memory;
  });

  app.post("/memories", async (request) => {
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: "a2a9b6f5-e453-4e5f-813d-a0bafd30a02e",
      },
    });
    return memory;
  });

  app.put("/memories/:id", async (request) => {
    const { id } = paramsSchema.parse(request.params);
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    const updateMemory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });
    return updateMemory;
  });

  app.delete("/memories/:id", async (request) => {
    const { id } = paramsSchema.parse(request.params);

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}

export { memoriesRoutes };
