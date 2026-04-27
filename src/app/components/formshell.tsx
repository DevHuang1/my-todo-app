export default function FormShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
            <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              {description}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
