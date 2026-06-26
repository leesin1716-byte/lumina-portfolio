import Link from "next/link";
import { AuroraBackdrop } from "@/components/sections/AuroraBackdrop";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/lib/content";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-16">
      <AuroraBackdrop />

      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          data-cursor="hover"
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <span className="relative grid h-7 w-7 place-items-center">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-iris via-violet to-magenta opacity-90" />
            <span className="relative h-2 w-2 rounded-full bg-bg" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {site.name}
          </span>
        </Link>
        {children}
      </div>
    </main>
  );
}
