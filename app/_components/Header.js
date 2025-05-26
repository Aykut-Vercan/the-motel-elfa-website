import Logo from "@/app/_components/Logo";
import Navigation from "@/app/_components/Navigation";



export default function Header() {
    return (
        <header className="border-b border-gray-500 px-6 py-3">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Logo />
                <Navigation />
            </div>
        </header>
    )
}
