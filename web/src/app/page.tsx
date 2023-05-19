import { Copyright } from "@/components/home/left/Copyright";
import { EmptyMemories } from "@/components/home/right/EmptyMemories";
import { Hero } from "@/components/home/left/Hero";
import { SignIn } from "@/components/home/left/SignIn";
import { Blur } from "@/components/home/left/Blur";
import { Stripes } from "@/components/home/left/Stripes";

export default function Home() {
  return (
    <main className="grid grid-cols-2 min-h-screen">
      {/* left */}
      <section className="relative flex flex-col items-start justify-between bg-[url('../assets/bg-stars.svg')] bg-cover px-28 py-16 overflow-hidden border-r border-white/10 ">
        <Blur />
        <Stripes />

        <SignIn />
        <Hero />
        <Copyright />
      </section>

      {/* right */}
      <section className="flex flex-col bg-[url('../assets/bg-stars.svg')] bg-cover p-16">
        <EmptyMemories />
      </section>
    </main>
  );
}
