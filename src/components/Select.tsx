import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
  placeholder?: string;
};

export function Select({
  label,
  options,
  placeholder = "Selecione uma opcao",
  id,
  className = "",
  ...props
}: SelectProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="grid gap-2 text-sm font-medium text-stone-800" htmlFor={fieldId}>
      {label}
      <select
        id={fieldId}
        className={`min-h-11 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 ${className}`.trim()}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
