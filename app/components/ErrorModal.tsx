"use client";

interface ErrorModalProps {
  errors: string[];
  onClose: () => void;
}

export default function ErrorModal({ errors, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[hsl(var(--background))] bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
        <h3 className="text-lg font-medium text-[hsl(var(--destructive))] mb-4">Erro de Validação</h3>
        <ul className="list-disc pl-5 mb-4">
          {errors.map((error, index) => (
            <li key={index} className="text-[hsl(var(--foreground))]">{error}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] py-2 px-4 rounded-md hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
