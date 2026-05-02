"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function NavLoadingLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();

    startTransition(() => {
      router.push(href);
    });
  };
  const defaultClasses = `rounded-lg px-3 py-2 text-sm font-medium transition-all ${
    isPending
      ? "text-indigo-400 bg-white/5"
      : "text-zinc-400 hover:bg-white/5 hover:text-white"
  }`;
  return (
    <Link
      href={href}
      onClick={handleNavigation}
      className={className || defaultClasses}
    >
      <span className={isPending ? "opacity-20" : "opacity-100"}>
        {children}
      </span>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      )}
    </Link>
  );
}
