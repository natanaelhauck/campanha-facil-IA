"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  onNavigate?: () => void;
  scrollTargetId?: string;
  variant?: "primary" | "secondary";
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-700",
  secondary:
    "border border-stone-300 bg-white text-stone-900 hover:bg-stone-50 focus:ring-stone-500",
};

export function Button({
  children,
  href,
  onNavigate,
  scrollTargetId,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${baseClass} ${variants[variant]} ${className}`.trim();
  const targetId =
    scrollTargetId ?? (href?.startsWith("#") ? href.slice(1) : undefined);

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();

    if (!targetId) {
      return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (href?.startsWith("#")) {
      history.replaceState(null, "", href);
    }
  }

  if (href) {
    return (
      <Link className={classes} href={href} onClick={handleAnchorClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
