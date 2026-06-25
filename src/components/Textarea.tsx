import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helpText?: string;
};

export function Textarea({
  label,
  helpText,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const fieldId = id ?? props.name;

  return (
    <label
      className={`grid gap-2 text-sm font-medium text-stone-800 ${className}`.trim()}
      htmlFor={fieldId}
    >
      {label}
      <textarea
        id={fieldId}
        className="min-h-28 resize-y rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        {...props}
      />
      {helpText ? <span className="text-xs font-normal text-stone-500">{helpText}</span> : null}
    </label>
  );
}
