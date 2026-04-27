import Link from "next/link";
import { loginUser } from "../lib/actions";
export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-extrabold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={loginUser}>
          <div>
            <label className="block text-sm font-semibold text-gray-200">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                required
                className="block w-full rounded-lg bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-200">
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                required
                className="block w-full rounded-lg bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all active:scale-[0.98]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign Up Here
          </Link>
        </p>
      </div>
    </div>
  );
}
