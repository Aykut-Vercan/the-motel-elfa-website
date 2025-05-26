
import Link from "next/link";


const NotFound = () => {
    return (
        <main className="text-center space-y-6 mt-4">
            <h1 className="text-3xl font-bold">This cabin could not be found!</h1>
            <Link href="/cabins" className="inline-block bg-accent-600 text-primary-100 hover:bg-accent-700 px-6 py-3 text-xl rounded-md">
                Back to Cabins
            </Link>
        </main>
    );
};

export default NotFound;
