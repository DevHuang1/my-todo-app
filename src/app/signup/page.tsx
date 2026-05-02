import Link from "next/link";
import { registerUser } from "../lib/actions";
import FormSubmit from "../components/formSubmit";

export default function SignUp({
  searchParams,
}: {
  searchParams: { status?: string; message?: string };
}) {
  const isSuccess =
    searchParams.status === "success" ||
    searchParams.message === "check-email-to-confirm";

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-extrabold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {isSuccess ? (
          /* SUCCESS MESSAGE BOX */
          <div className="rounded-xl bg-indigo-500/10 p-6 border border-indigo-500/20 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 mb-4">
              <svg
                className="h-6 w-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Check your email</h3>
            <p className="mt-2 text-sm text-indigo-200/60 leading-relaxed">
              We've sent a verification link to your inbox. Please click it to
              activate your account.
            </p>
            <Link
              href="/login"
              className="mt-6 block text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form className="space-y-6" action={registerUser}>
            <div>
              <label className="block text-sm font-semibold text-gray-200">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  name="name"
                  type="text"
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
                  name="email"
                  type="email"
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
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-lg bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <FormSubmit label="Create Account" />
          </form>
        )}

        {!isSuccess && (
          <p className="mt-10 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign in here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
