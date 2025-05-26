import Link from "next/link";
import { auth } from "../_lib/auth";
import Image from "next/image";
const Navigation = async () => {
    const session = await auth();//bu sayfayı dinamik yapar cünkü auth degişkendir önceden bilemeyiz ve statik olamaz

    return (
        <nav className="z-10 text-xl">
            <ul className="flex gap-16">
                {/* <li>
                    <Link href="/" className="hover:text-stone-400 transition-colors">
                        Home
                    </Link>
                </li> */}
                <li>
                    <Link
                        href="/cabins"
                        className="hover:text-stone-400 transition-colors"
                    >
                        Cabins
                    </Link>
                </li>
                <li>
                    <Link href="/about" className="hover:text-stone-400 transition-colors">
                        About
                    </Link>
                </li>
                <li>
                    {session?.user?.image ? (
                        <Link
                            href="/account"
                            className="hover:text-stone-400 transition-colors flex items-center gap-4"
                        >
                            <Image
                                width={32}
                                height={32}
                                className="h-8 rounded-full"
                                src={session.user.image}
                                alt={session.user.name}
                                referrerPolicy="no-referrer"
                            />
                            <span>Account</span>
                        </Link>
                    ) : (
                        <Link
                            href="/account"
                            className="hover:text-stone-400 transition-colors"
                        >
                            Account
                        </Link>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
