import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import image2 from "@/public/about-2.jpg";
import Link from "next/link";
import { getCabins } from "../_lib/data-service";

//getCabins() fonksiyonu ile kabin verileri build zamanında çekiliyor

export const revalidate = 86400;

export default async function Page() {

    const cabins = await getCabins();
    const cabinCount = cabins.length;

    return (
        <div className=" grid grid-cols-5 gap-x-24 gap-y-32 text-md items-center">
            <div className="col-span-3">
                <h1 className=" text-4xl mb-10 text-accent-400 font-medium">
                    Welcome to The Motel Elfa
                </h1>
                <div className="space-y-8">
                    <p>
                        Where nature&apos;s beauty and comfortable living blend seamlessly.
                        Hidden away in the heart of the Italian Dolomites, this is your
                        paradise away from home. But it&apos;s not just about the luxury
                        cabins. It&apos;s about the experience of reconnecting with nature
                        and enjoying simple pleasures with family.
                    </p>
                    <p>
                        Our {cabinCount} luxury cabins provide a cozy base, but the real
                        freedom and peace you&apos;ll find in the surrounding mountains.
                        Wander through lush forests, breathe in the fresh air, and watch the
                        stars twinkle above from the warmth of a campfire or your hot tub.
                    </p>
                    <p>
                        This is where memorable moments are made, surrounded by
                        nature&apos;s splendor. It&apos;s a place to slow down, relax, and
                        feel the joy of being together in a beautiful setting.
                    </p>
                </div>
            </div>

            <div className=" relative aspect-square col-span-2">
                <Image
                    fill
                    src={image1}
                    className="object-cover"
                    alt="Family sitting around a fire pit in front of cabin"
                />
            </div>

            <div className="relative aspect-square col-span-2">
                <Image
                    fill
                    placeholder="blur"
                    className="object-cover"
                    src={image2}
                    alt="Family that manages The Wild Oasis"
                />
            </div>

            <div className="col-span-3">
                <h1 className="text-4xl mb-10 text-accent-400 font-medium">
                    Managed by our family since 1907
                </h1>

                <div className=" space-y-8">
                    <p>
                        Since 1907, The Wild Oasis has been a cherished family-run retreat.
                        Started by our grandparents, this haven has been nurtured with love
                        and care, passing down through our family as a testament to our
                        dedication to creating a warm, welcoming environment.
                    </p>
                    <p>
                        Over the years, we&apos;ve maintained the essence of The Wild Oasis,
                        blending the timeless beauty of the mountains with the personal
                        touch only a family business can offer. Here, you&apos;re not just a
                        guest; you&apos;re part of our extended family. So join us at The
                        Wild Oasis soon, where tradition meets tranquility, and every visit
                        is like coming home.
                    </p>

                    <div>
                        <Link
                            href="/cabins"
                            className=" inline-block mt-4 rounded-md bg-lime-700 px-8 py-5  text-primary-200 text-lg font-semibold hover:bg-lime-600 hover:text-primary-100  transition-all"
                        >
                            Explore our luxury cabins
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
