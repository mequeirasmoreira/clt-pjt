"use client";

interface ResultsProps {
  data: {
    cltSalary: number;
    pjSalary: number;
    benefits: number;
    healthInsurance: number;
    mealAllowance: number;
    transportAllowance: number;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export default function Results({ data }: ResultsProps) {
  // Cálculos CLT
  const inssBase = data.cltSalary;
  let inss = 0;

  if (inssBase <= 1412) {
    inss = inssBase * 0.075;
  } else if (inssBase <= 2666.68) {
    inss = inssBase * 0.09 - 21.18;
  } else if (inssBase <= 4000.03) {
    inss = inssBase * 0.12 - 101.18;
  } else if (inssBase <= 7786.02) {
    inss = inssBase * 0.14 - 181.18;
  } else {
    inss = 876.97; // Teto INSS 2024
  }

  const baseIR = data.cltSalary - inss;
  let irrf = 0;

  if (baseIR <= 2112) {
    irrf = 0;
  } else if (baseIR <= 2826.65) {
    irrf = baseIR * 0.075 - 158.40;
  } else if (baseIR <= 3751.05) {
    irrf = baseIR * 0.15 - 370.40;
  } else if (baseIR <= 4664.68) {
    irrf = baseIR * 0.225 - 651.73;
  } else {
    irrf = baseIR * 0.275 - 884.96;
  }

  const totalBenefits = data.benefits + data.healthInsurance + data.mealAllowance + data.transportAllowance;
  const cltLiquid = data.cltSalary - inss - irrf;
  const cltTotal = cltLiquid + totalBenefits;

  // Cálculos PJ
  const pjTaxes = data.pjSalary * 0.06; // Simples Nacional 6%
  const pjLiquid = data.pjSalary - pjTaxes;
  const monthlyDifference = pjLiquid - cltTotal;

  return (
    <div className="mt-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Resultado da Comparação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CLT Section */}
            <div>
              <h4 className="text-lg font-semibold text-blue-600 mb-4">Regime CLT</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Salário Bruto</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(data.cltSalary)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">INSS</dt>
                  <dd className="font-medium text-red-600">-{formatCurrency(inss)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">IRRF</dt>
                  <dd className="font-medium text-red-600">-{formatCurrency(irrf)}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="text-gray-600">Salário Líquido</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(cltLiquid)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Total Benefícios</dt>
                  <dd className="font-medium text-green-600">+{formatCurrency(totalBenefits)}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="font-semibold text-gray-900">Total Final</dt>
                  <dd className="font-bold text-gray-900">{formatCurrency(cltTotal)}</dd>
                </div>
              </dl>
            </div>

            {/* PJ Section */}
            <div>
              <h4 className="text-lg font-semibold text-green-600 mb-4">Regime PJ</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Valor Bruto</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(data.pjSalary)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Simples Nacional (6%)</dt>
                  <dd className="font-medium text-red-600">-{formatCurrency(pjTaxes)}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="font-semibold text-gray-900">Total Final</dt>
                  <dd className="font-bold text-gray-900">{formatCurrency(pjLiquid)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Monthly Difference */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900">Diferença Mensal</h4>
              <div className={`text-xl font-bold ${monthlyDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyDifference >= 0 ? '+' : ''}{formatCurrency(monthlyDifference)}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {monthlyDifference >= 0 
                ? 'O regime PJ é mais vantajoso financeiramente' 
                : 'O regime CLT é mais vantajoso financeiramente'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
