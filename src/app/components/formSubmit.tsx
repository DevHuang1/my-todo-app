import { useFormStatus } from "react-dom";

export default function FormSubmit({
  label = "Create Account",
}: {
  label?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Creating account..." : label}
      </button>

      {pending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Please wait...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
