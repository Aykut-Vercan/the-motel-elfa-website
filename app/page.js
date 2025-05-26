import Image from "next/image";
import Link from "next/link";
import bg from "@/public/bg.png";
export default function Page() {
  return (
    <main className="mt-24 ">
      <Image
        src={bg}
        fill
        quality={100}
        className="object-cover object-top"
        placeholder="blur"
        alt="Mountains and forests with two cabins"
      />
      <div className="relative z-10 text-center">
        <h1 className="text-6xl text-accent-50 mb-10 tracking-wide font-bold">
          Join the Happiness
        </h1>
        <Link
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg hover:bg-accent-600 transition-all rounded-md "
          href="/cabins"
        >
          Explore your room
        </Link>
      </div>
    </main>
  );
}
