'use client';

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingText }) {

    //useFormStatus sadece form içeren bi componentte kullanamayız sadece form tarafından işlenen bi yerde kullanabiliriz
    const { pending } = useFormStatus();
    return (
        <button
            className="bg-lime-600 px-8 py-4 text-primary-200 rounded-md font-semibold hover:bg-lime-700 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
            disabled={pending}
        >
            {pending ? pendingText : children}
        </button>
    );
}