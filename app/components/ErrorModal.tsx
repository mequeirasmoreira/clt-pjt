"use client";

interface ErrorModalProps {
  errors: string[];
  onClose: () => void;
}

export default function ErrorModal({ errors, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium text-red-600 mb-4">Erro de Validação</h3>
        <ul className="list-disc pl-5 mb-4">
          {errors.map((error, index) => (
            <li key={index} className="text-gray-700">{error}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
