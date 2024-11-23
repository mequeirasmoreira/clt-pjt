"use client";

import InputField from './InputField';

interface PJSectionProps {
  formState: {
    pjSalary: string;
  };
  handleChange: (field: string) => (value: string) => void;
}

export default function PJSection({ formState, handleChange }: PJSectionProps) {
  return (
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
          value={formState.pjSalary}
          onChange={handleChange('pjSalary')}
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
  );
}
