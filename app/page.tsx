"use client";

import { useState } from 'react';
import Forms from './components/Forms';
import Result from './components/Result';

interface FormData {
  // CLT
  cltSalary: number;
  cltHoursPerDay: number;
  cltDaysPerWeek: number;
  healthInsurance: number;
  healthInsuranceEmployee: number;
  mealAllowance: number;
  transportAllowance: number;
  useTransportAllowance: boolean;
  otherBenefits: number;
  hasThirteenth: boolean;
  hasVacation: boolean;
  hasFGTS: boolean;
  hasProfit: boolean;
  profitValue: number;
  
  // PJ
  pjSalary: number;
  pjHoursPerDay: number;
  pjDaysPerWeek: number;
  pjVacationDays: number;
  pjHasThirteenth: boolean;
  pjTransportCosts: {
    type: 'car' | 'public' | 'other';
    distance?: number;
    fuelPrice?: number;
    fuelEfficiency?: number;
    publicTransportCost?: number;
    otherCost?: number;
  };
  pjHealthInsurance: number;
  pjMealCosts: number;
  pjCompanyType: 'mei' | 'simples' | 'lucro_presumido';
  pjHasAccountant: boolean;
  pjAccountantCost: number;
  pjHasWorkspace: boolean;
  pjWorkspaceCost: number;
  pjHasEquipment: boolean;
  pjEquipmentCost: number;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData | null>(() => {
    // Tenta recuperar dados salvos do localStorage
    const savedData = localStorage.getItem('form_data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Converte strings para números
      Object.keys(parsedData).forEach(key => {
        if (typeof parsedData[key] === 'string' && !isNaN(Number(parsedData[key]))) {
          parsedData[key] = Number(parsedData[key]);
        }
      });
      return parsedData;
    }
    return null;
  });

  const handleSubmit = (data: FormData) => {
    // Converte strings para números
    const numericData = { ...data };
    Object.keys(numericData).forEach(key => {
      if (typeof numericData[key] === 'string' && !isNaN(Number(numericData[key]))) {
        numericData[key] = Number(numericData[key]);
      }
    });
    setFormData(numericData);
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
          {formData && <Result data={formData} />}
        </div>
      </div>
    </div>
  );
}
