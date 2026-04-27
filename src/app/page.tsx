import Link from "next/link";

export default function Welcome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-6 py-12 text-center">
      <div className="max-w-md">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-16 w-auto"
        />

        <h1 className="mt-10 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Welcome to the Platform
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-400">
          A high-performance workspace designed for your next big project.
          Everything you need, built with speed and precision.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all active:scale-95"
          >
            Get started
          </Link>

          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors"
          >
            Sign in <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Subtle Background Decoration */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
