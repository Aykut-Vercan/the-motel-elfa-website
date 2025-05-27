"use client";
import { updateProfile } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

export default function UpdateProfileForm({ children, guest }) {
    const { fullName, email, nationality, nationalID, countryFlag } = guest;

    //useFormStatus sadece form içeren bi componentte kullanamayız sadece form tarafından işlenen bi yerde kullanabiliriz

    return (
        <div>
            <form
                action={updateProfile}
                className="bg-primary-900 py-6 px-10 text-lg flex flex-col gap-6"
            >
                <div className="space-y-2">
                    <label>Full Name</label>
                    <input
                        disabled
                        name="fullName"
                        defaultValue={fullName}
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                    />
                </div>
                <div className="space-y-2">
                    <label>Email address</label>
                    <input
                        disabled
                        name="email"
                        defaultValue={email}
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="nationality">Where are you from?</label>
                        {/*img normalde burası*/}
                        {countryFlag ? (
                            <img src={countryFlag} alt="Country flag" className="h-5 rounded-sm" />
                        ) : (
                            <span className="text-sm text-gray-500">No flag selected</span>
                        )}
                    </div>
                    {children}
                </div>
                <div className="space-y-2">
                    <label htmlFor="nationalID">National ID number</label>
                    <input
                        name="nationalID"
                        defaultValue={nationalID}
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    />
                </div>

                <div className="flex justify-end items-center gap-6">
                    {/* bu sayede useFormStatus  formu bilecek */}
                    <SubmitButton pendingText="Updating..." >Update profile</SubmitButton>
                </div>
            </form>
        </div>
    );
}
