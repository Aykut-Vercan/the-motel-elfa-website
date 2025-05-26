import { auth } from "../_lib/auth"


const Page = async () => {
    const session = await auth();
    console.log(session)
    const firstName = session.user.name.split(" ").at(0)
    const formattedName = firstName[0].toUpperCase() + firstName.slice(1);
    return (
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
            Welcome, {formattedName}
        </h2>
    )
}

export default Page