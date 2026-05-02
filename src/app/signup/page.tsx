import Link from "next/link";
import { registerUser } from "../lib/actions";
import FormSubmit from "../components/formSubmit";
export default function SignUp() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-extrabold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action={registerUser}>
          <div>
            <label className="block text-sm font-semibold text-gray-200">
              Full Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="block w-full rounded-lg bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                required
                className="block w-full rounded-lg bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                required
                name="password"
                className="block w-full rounded-lg bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <FormSubmit label="Create Account" />
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
