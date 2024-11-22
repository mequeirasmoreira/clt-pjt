"use client";
import { useState, useEffect, useRef } from 'react';

interface FormData {
    cltSalary: number | '';
    pjSalary: number | '';
    benefits: number | '';
    healthInsurance: number | '';
    mealAllowance: number | '';
    transportAllowance: number | '';
}

interface FormProps {
    onSubmit: (data: FormData) => void;
}

export default function Form({ onSubmit }: FormProps) {
  const [cltSalary, setCltSalary] = useState<number | ''>('');
  const [pjSalary, setPjSalary] = useState<number | ''>('');
  const [benefits, setBenefits] = useState<number | ''>('');
  const [healthInsurance, setHealthInsurance] = useState<number | ''>('');
  const [mealAllowance, setMealAllowance] = useState<number | ''>('');
  const [transportAllowance, setTransportAllowance] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const totalBenefits = (benefits || 0) + (healthInsurance || 0) + (mealAllowance || 0) + (transportAllowance || 0);
    onSubmit({ 
        cltSalary: cltSalary, 
        pjSalary: pjSalary, 
        benefits: totalBenefits,
        healthInsurance: healthInsurance,
        mealAllowance: mealAllowance,
        transportAllowance: transportAllowance
    });
  };

  const InputField = ({ label, value, onChange, placeholder }: { 
    label: string; 
    value: number | ''; 
    onChange: (value: number | '') => void;
    placeholder: string;
  }) => {
    const prevValue = useRef<number | ''>(); 
    const [inputValue, setInputValue] = useState(value === '' ? '' : value.toString());

    useEffect(() => {
      if (value !== prevValue.current) {
        setInputValue(value === '' ? '' : value.toString());
        prevValue.current = value; 
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/\D/g, '');
      setInputValue(newValue);

      if (newValue === '') {
        onChange('');
      } else {
        onChange(parseInt(newValue, 10));
      }
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">R$</span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="px-6 py-8 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* CLT Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Regime CLT</h3>
                <p className="mt-1 text-sm text-gray-500">Informe os valores do regime CLT</p>
              </div>
            </div>

            <div className="space-y-4">
              <InputField
                label="Salário Bruto CLT"
                value={cltSalary}
                onChange={setCltSalary}
                placeholder="5000"
              />
              <InputField
                label="Vale Refeição"
                value={mealAllowance}
                onChange={setMealAllowance}
                placeholder="800"
              />
              <InputField
                label="Vale Transporte"
                value={transportAllowance}
                onChange={setTransportAllowance}
                placeholder="200"
              />
              <InputField
                label="Plano de Saúde"
                value={healthInsurance}
                onChange={setHealthInsurance}
                placeholder="500"
              />
              <InputField
                label="Outros Benefícios"
                value={benefits}
                onChange={setBenefits}
                placeholder="300"
              />
            </div>
          </div>

          {/* PJ Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Regime PJ</h3>
                <p className="mt-1 text-sm text-gray-500">Informe o valor da proposta PJ</p>
              </div>
            </div>

            <div className="space-y-4">
              <InputField
                label="Valor Mensal PJ"
                value={pjSalary}
                onChange={setPjSalary}
                placeholder="7000"
              />

              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Importante lembrar</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Pagar seus próprios impostos</li>
                        <li>Gerenciar férias e 13º</li>
                        <li>Contratar plano de saúde</li>
                        <li>Não tem FGTS</li>
                        <li>Não tem benefícios trabalhistas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 bg-gray-50 sm:px-10">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Calcular Comparação
        </button>
      </div>
    </form>
  );
}