"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filter() {
    const searchParams = useSearchParams(); //url paramsını almak için kullandık
    const router = useRouter(); //Next.js teki rotalar arasında programatik gezinti yapmamızı sağlayacak
    const pathname = usePathname();

    function handleFilter(filter) {
        const params = new URLSearchParams(searchParams); //sorgu parametrelerini manipüle etmek için kullanılır
        params.set("capacity", filter); //bu sayede url Parametresi bu sekilde set edebiliriz ama bizi yönlendirmez
        //yönlendirme için router kullanacagız ama bu da next/navigation dan olacak sebebiini bilmiyorum
        router.replace(`${pathname}?${params.toString()}`, { scroll: false }); //scrool false tekrar yukarı çıkmayı engeller routingten sora
    }

    const activeFilter = searchParams.get("capacity") ?? "all";

    return (
        <div className="border rounded-xl border-primary-800 flex">
            <Button
                filter="all"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                All
            </Button>

            <Button
                filter="small"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                1&mdash;3 guests
            </Button>
            <Button
                filter="medium"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                4&mdash;7 guests
            </Button>
            <Button
                filter="large"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                8&mdash;12 guests
            </Button>
        </div>
    );

    function Button({ filter, handleFilter, activeFilter, children }) {
        return <button
            className={`px-5 py-2 hover:bg-primary-600 rounded-xl ${filter === activeFilter ? "bg-primary-600 text-primary-100 text-lg " : ""}`}
            onClick={() => handleFilter(filter)}
        >
            {children}
        </button>;
    }
}
