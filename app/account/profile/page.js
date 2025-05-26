
import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-service";

export default async function Page() {

    const session = await auth();
    const guest = await getGuest(session.user.email);


    return (
        <div>
            <h2 className="font-semibold text-2xl mb-4 text-accent-400">
                Update your profile
            </h2>
            <p className="text-lg mb-8 text-primary-200">
                Providing the following information will make your check-in process
                faster and smoother. See you soon!
            </p>
            {/* client component'e server component'i props olarak geçiyorum */}
            <UpdateProfileForm guest={guest}>
                <SelectCountry
                    key={guest.nationality}
                    name="nationality"
                    id="nationality"
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    defaultCountry={guest.nationality || "Unknown"}

                />
            </UpdateProfileForm>
        </div>
    );
}
