import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FinderWindow({
  title,
  path,
  children,
  className,
}: {
  title: string;
  path: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-black/8 bg-[#f3f1ee] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-black/6 px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <p className="ml-2 flex-1 truncate text-center font-serif text-[13px] tracking-wide text-black/55">
          {title}
        </p>
        <span className="w-12" />
      </div>
      <div className="flex items-center gap-2 border-b border-black/5 px-3 py-1.5 text-[11px] tracking-wide text-black/40">
        <span className="inline-flex size-5 items-center justify-center rounded-md bg-white/80">
          ⌂
        </span>
        <span>{path}</span>
      </div>
      {children}
    </div>
  );
}
