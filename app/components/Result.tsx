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

interface ResultProps {
  data: FormData;
}

// Função para calcular horas mensais
const calculateMonthlyHours = (hoursPerDay: number, daysPerWeek: number): number => {
  const weeksInMonth = 52 / 12; // Média de semanas por mês
  return hoursPerDay * daysPerWeek * weeksInMonth;
};

// Função para calcular valor por hora
const calculateHourlyRate = (monthlyValue: number, hoursPerDay: number, daysPerWeek: number): number => {
  const monthlyHours = calculateMonthlyHours(hoursPerDay, daysPerWeek);
  return monthlyHours > 0 ? monthlyValue / monthlyHours : 0;
};

// Função para calcular custos de transporte PJ
const calculatePJTransportCosts = (transportCosts: FormData['pjTransportCosts']): number => {
  if (transportCosts.type === 'car' && transportCosts.distance && transportCosts.fuelPrice && transportCosts.fuelEfficiency) {
    // Calcula o custo diário de combustível
    const dailyCost = (Number(transportCosts.distance) * Number(transportCosts.fuelPrice)) / Number(transportCosts.fuelEfficiency);
    // Multiplica por 22 dias úteis no mês
    return dailyCost * 22;
  } else if (transportCosts.type === 'public' && transportCosts.publicTransportCost) {
    return Number(transportCosts.publicTransportCost);
  } else if (transportCosts.type === 'other' && transportCosts.otherCost) {
    return Number(transportCosts.otherCost);
  }
  return 0;
};

// Formatador de moeda
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const Result = ({ data }: ResultProps) => {
  // Cálculos CLT
  const inssBase = data.cltSalary;
  let inss = 0;

  // Cálculo do INSS
  if (inssBase <= 1320) {
    inss = inssBase * 0.075;
  } else if (inssBase <= 2571.29) {
    inss = inssBase * 0.09;
  } else if (inssBase <= 3856.94) {
    inss = inssBase * 0.12;
  } else if (inssBase <= 7507.49) {
    inss = inssBase * 0.14;
  } else {
    inss = 7507.49 * 0.14; // Teto do INSS
  }

  // Benefícios CLT
  const monthlyBenefits = (
    (data.healthInsurance || 0) +
    (data.mealAllowance || 0) +
    (data.useTransportAllowance ? (data.transportAllowance || 0) : 0) +
    (data.otherBenefits || 0)
  );

  const yearlyBenefits = monthlyBenefits * 12;

  // Cálculo do FGTS
  const fgts = data.hasFGTS ? data.cltSalary * 0.08 : 0;

  // Cálculo do 13º e férias
  const thirteenth = data.hasThirteenth ? data.cltSalary : 0;
  const vacation = data.hasVacation ? data.cltSalary / 3 : 0;

  // Participação nos lucros
  const profit = data.hasProfit ? (data.profitValue || 0) : 0;

  // Total anual CLT
  const cltAnnualTotal = (
    (data.cltSalary * 12) +
    thirteenth +
    vacation +
    (fgts * 12) +
    yearlyBenefits +
    profit -
    (inss * 12) -
    (data.healthInsuranceEmployee || 0) * 12
  );

  // Cálculos PJ
  const pjMonthlyGross = data.pjSalary;
  
  // Custos mensais PJ
  const pjTransportCosts = calculatePJTransportCosts(data.pjTransportCosts);
  const pjHealthInsurance = data.pjHealthInsurance || 0;
  const pjMealCosts = data.pjMealCosts || 0;
  const pjAccountantCost = data.pjHasAccountant ? (data.pjAccountantCost || 0) : 0;
  const pjWorkspaceCost = data.pjHasWorkspace ? (data.pjWorkspaceCost || 0) : 0;
  const pjEquipmentCost = data.pjHasEquipment ? (data.pjEquipmentCost || 0) / 12 : 0; // Dividido por 12 para mensalizar

  // Impostos PJ
  let pjTaxRate = 0;
  switch (data.pjCompanyType) {
    case 'mei':
      pjTaxRate = 0.06; // 6% para MEI
      break;
    case 'simples':
      pjTaxRate = 0.09; // 9% para Simples Nacional (média aproximada)
      break;
    case 'lucro_presumido':
      pjTaxRate = 0.165; // 16.5% para Lucro Presumido (média aproximada)
      break;
  }

  const pjMonthlyTax = pjMonthlyGross * pjTaxRate;

  // Provisões PJ
  const pjVacationProvision = (pjMonthlyGross / 12) * (data.pjVacationDays / 30);
  const pjThirteenthProvision = data.pjHasThirteenth ? (pjMonthlyGross / 12) : 0;

  // Total de custos mensais PJ
  const pjMonthlyCosts = (
    pjTransportCosts +
    pjHealthInsurance +
    pjMealCosts +
    pjAccountantCost +
    pjWorkspaceCost +
    pjEquipmentCost +
    pjMonthlyTax +
    pjVacationProvision +
    pjThirteenthProvision
  );

  // Total anual PJ
  const pjAnnualTotal = (pjMonthlyGross * 12) - (pjMonthlyCosts * 12);

  // Cálculo da diferença
  const difference = pjAnnualTotal - cltAnnualTotal;
  const percentageDifference = (cltAnnualTotal > 0 ? (difference / cltAnnualTotal) * 100 : 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultado da Comparação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regime CLT</h3>
          <div className="space-y-2">
            <p>Salário Bruto Mensal: {formatter.format(data.cltSalary)}</p>
            <p>INSS Mensal: {formatter.format(inss)}</p>
            <p>FGTS Mensal: {formatter.format(fgts)}</p>
            <p>Benefícios Mensais: {formatter.format(monthlyBenefits)}</p>
            <p>13º Salário: {formatter.format(thirteenth)}</p>
            <p>Férias + 1/3: {formatter.format(vacation)}</p>
            <p>Participação nos Lucros: {formatter.format(profit)}</p>
            <p className="font-semibold">Total Anual: {formatter.format(cltAnnualTotal)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regime PJ</h3>
          <div className="space-y-2">
            <p>Valor Bruto Mensal: {formatter.format(pjMonthlyGross)}</p>
            <p>Impostos Mensais: {formatter.format(pjMonthlyTax)}</p>
            <p>Custos de Transporte: {formatter.format(pjTransportCosts)}</p>
            <p>Plano de Saúde: {formatter.format(pjHealthInsurance)}</p>
            <p>Custos de Alimentação: {formatter.format(pjMealCosts)}</p>
            <p>Contador: {formatter.format(pjAccountantCost)}</p>
            <p>Espaço de Trabalho: {formatter.format(pjWorkspaceCost)}</p>
            <p>Equipamentos: {formatter.format(pjEquipmentCost)}</p>
            <p>Provisão Férias: {formatter.format(pjVacationProvision)}</p>
            <p>Provisão 13º: {formatter.format(pjThirteenthProvision)}</p>
            <p className="font-semibold">Total Anual: {formatter.format(pjAnnualTotal)}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Comparação Final</h3>
        <div className="space-y-4">
          <p className="text-lg">
            Diferença Anual: {' '}
            <span className={`font-semibold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatter.format(difference)}
            </span>
          </p>
          <p className="text-lg">
            Diferença Percentual: {' '}
            <span className={`font-semibold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentageDifference.toFixed(2)}%
            </span>
          </p>
          <p className="text-lg font-medium">
            Regime mais vantajoso: {' '}
            <span className="font-bold">
              {difference > 0 ? 'PJ' : difference < 0 ? 'CLT' : 'Equivalentes'}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">Observações Importantes</h4>
        <ul className="list-disc pl-5 space-y-2 text-blue-800">
          <li>Os cálculos são aproximados e podem variar dependendo de diversos fatores</li>
          <li>Considere também aspectos não financeiros como estabilidade e direitos trabalhistas</li>
          <li>Consulte um contador para análises mais detalhadas sobre sua situação específica</li>
          <li>Os impostos podem variar dependendo do seu faturamento e enquadramento</li>
        </ul>
      </div>
    </div>
  );
};

export default Result;