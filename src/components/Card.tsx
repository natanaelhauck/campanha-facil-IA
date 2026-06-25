import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-stone-200 bg-white p-6 shadow-sm ${className}`.trim()}
    >
      {children}
    </div>
  );
}
