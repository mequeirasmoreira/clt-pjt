"use client";

import { useState } from 'react';
import Forms from './components/Forms';
import Result from './components/Result';

interface FormData {
  cltSalary: number | '';
  pjSalary: number | '';
  benefits: number | '';
  healthInsurance: number | '';
  mealAllowance: number | '';
  transportAllowance: number | '';
}

export default function Home() {
  const [result, setResult] = useState(null);

  const handleSubmit = async (data: FormData) => {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Calculadora</span>
            <span className="block text-blue-600">CLT vs PJ</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Compare os regimes de contratação e descubra qual é mais vantajoso para você,
            considerando salário, benefícios e impostos.
          </p>
        </div>
        
        <div className="space-y-8">
          <Forms onSubmit={handleSubmit} />
          {result && <Result data={result} />}
        </div>
      </div>
    </div>
  );
}
