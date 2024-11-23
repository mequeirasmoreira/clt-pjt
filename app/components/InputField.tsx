"use client";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function InputField({ label, value, onChange, placeholder }: InputFieldProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">R$</span>
        </div>
        <input
          type="number"
          pattern="^\s*[0-9]*\s*$"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            e.target.focus();
          }}
          autoComplete="off"
          className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
