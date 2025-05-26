import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOutAction } from "../_lib/actions";
function SignOutButton() {
  return (
    <form action={signOutAction} className="bg-red-500 hover:text-slate-100 hover:bg-white transition-all group">

      <button className="py-3 px-5 w-full flex items-center gap-4 font-semibold text-red-100 group-hover:text-red-700">
        <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-red-100 group-hover:text-red-700" />
        <span>Sign out</span>
      </button>
    </form>
  );
}

export default SignOutButton;
