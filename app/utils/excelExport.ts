import * as XLSX from 'xlsx';
import { FormData } from '../components/Forms';

interface ComparisonResult {
  clt: {
    totalSalary: number;
    benefits: {
      healthInsurance: number;
      mealAllowance: number;
      transportAllowance: number;
      thirteenth: number;
      vacation: number;
      fgts: number;
      profit: number;
    };
    totalBenefits: number;
    totalCost: number;
  };
  pj: {
    totalSalary: number;
    costs: {
      healthInsurance: number;
      mealCosts: number;
      transportCosts: number;
      accountant: number;
      workspace: number;
      equipment: number;
    };
    totalCosts: number;
    netIncome: number;
  };
}

const calculateMonthlyValues = (data: FormData): ComparisonResult => {
  // CLT Calculations
  const cltMonthly = {
    totalSalary: data.cltSalary,
    benefits: {
      healthInsurance: data.healthInsurance - (data.healthInsuranceEmployee || 0),
      mealAllowance: data.mealAllowance * 0.8, // 20% de desconto
      transportAllowance: data.useTransportAllowance ? 
        Math.min(data.transportAllowance, data.cltSalary * 0.06) : 0,
      thirteenth: data.hasThirteenth ? data.cltSalary / 12 : 0,
      vacation: data.hasVacation ? (data.cltSalary * 1.33) / 12 : 0, // 1/3 de férias
      fgts: data.hasFGTS ? data.cltSalary * 0.08 : 0,
      profit: data.hasProfit ? data.profitValue / 12 : 0,
    },
    get totalBenefits() {
      return Object.values(this.benefits).reduce((a, b) => a + b, 0);
    },
    get totalCost() {
      return this.totalSalary + this.totalBenefits;
    }
  };

  // PJ Calculations
  const pjMonthly = {
    totalSalary: data.pjSalary,
    costs: {
      healthInsurance: data.pjHealthInsurance,
      mealCosts: data.pjMealCosts,
      transportCosts: calculateTransportCosts(data.pjTransportCosts),
      accountant: data.pjHasAccountant ? data.pjAccountantCost : 0,
      workspace: data.pjHasWorkspace ? data.pjWorkspaceCost : 0,
      equipment: data.pjHasEquipment ? data.pjEquipmentCost / 12 : 0, // Dividido por 12 para mensalizar
    },
    get totalCosts() {
      return Object.values(this.costs).reduce((a, b) => a + b, 0);
    },
    get netIncome() {
      return this.totalSalary - this.totalCosts;
    }
  };

  return { clt: cltMonthly, pj: pjMonthly };
};

const calculateTransportCosts = (transportCosts: FormData['pjTransportCosts']): number => {
  switch (transportCosts.type) {
    case 'car':
      const workDays = 22; // média de dias úteis no mês
      const dailyCost = 
        ((transportCosts.distance || 0) / (transportCosts.fuelEfficiency || 1)) * 
        (transportCosts.fuelPrice || 0);
      return dailyCost * workDays;
    case 'public':
      return transportCosts.publicTransportCost || 0;
    case 'other':
      return transportCosts.otherCost || 0;
    default:
      return 0;
  }
};

export const exportToExcel = (data: FormData) => {
  const results = calculateMonthlyValues(data);
  
  const workbook = XLSX.utils.book_new();
  
  // Criando a planilha de comparação mensal
  const monthlyComparison = [
    ['Comparação CLT x PJ - Valores Mensais'],
    [''],
    ['Regime CLT'],
    ['Salário Base', results.clt.totalSalary],
    [''],
    ['Benefícios'],
    ['Plano de Saúde', results.clt.benefits.healthInsurance],
    ['Vale Refeição', results.clt.benefits.mealAllowance],
    ['Vale Transporte', results.clt.benefits.transportAllowance],
    ['13º Salário (Mensal)', results.clt.benefits.thirteenth],
    ['Férias (Mensal)', results.clt.benefits.vacation],
    ['FGTS', results.clt.benefits.fgts],
    ['Participação nos Lucros (Mensal)', results.clt.benefits.profit],
    ['Total Benefícios', results.clt.totalBenefits],
    ['Total CLT', results.clt.totalCost],
    [''],
    ['Regime PJ'],
    ['Valor Bruto', results.pj.totalSalary],
    [''],
    ['Custos'],
    ['Plano de Saúde', results.pj.costs.healthInsurance],
    ['Alimentação', results.pj.costs.mealCosts],
    ['Transporte', results.pj.costs.transportCosts],
    ['Contador', results.pj.costs.accountant],
    ['Espaço de Trabalho', results.pj.costs.workspace],
    ['Equipamentos (Mensal)', results.pj.costs.equipment],
    ['Total Custos', results.pj.totalCosts],
    ['Valor Líquido PJ', results.pj.netIncome],
    [''],
    ['Comparação Final'],
    ['Diferença Mensal (PJ - CLT)', results.pj.netIncome - results.clt.totalCost],
  ];

  // Criando a planilha de comparação anual
  const yearlyComparison = [
    ['Comparação CLT x PJ - Valores Anuais'],
    [''],
    ['Regime CLT'],
    ['Salário Base Anual', results.clt.totalSalary * 12],
    ['Total Benefícios Anual', results.clt.totalBenefits * 12],
    ['Total CLT Anual', results.clt.totalCost * 12],
    [''],
    ['Regime PJ'],
    ['Valor Bruto Anual', results.pj.totalSalary * 12],
    ['Total Custos Anual', results.pj.totalCosts * 12],
    ['Valor Líquido PJ Anual', results.pj.netIncome * 12],
    [''],
    ['Comparação Final'],
    ['Diferença Anual (PJ - CLT)', (results.pj.netIncome - results.clt.totalCost) * 12],
  ];

  // Adicionando as planilhas ao workbook
  const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyComparison);
  const wsYearly = XLSX.utils.aoa_to_sheet(yearlyComparison);
  
  // Formatação das células
  ['B4', 'B7:B14', 'B18', 'B21:B27', 'B31'].forEach(ref => {
    if (!wsMonthly[ref]) wsMonthly[ref] = {};
    wsMonthly[ref].z = '"R$"#,##0.00';
  });

  ['B4:B6', 'B9:B11', 'B14'].forEach(ref => {
    if (!wsYearly[ref]) wsYearly[ref] = {};
    wsYearly[ref].z = '"R$"#,##0.00';
  });

  // Adicionando as planilhas ao workbook
  XLSX.utils.book_append_sheet(workbook, wsMonthly, 'Comparação Mensal');
  XLSX.utils.book_append_sheet(workbook, wsYearly, 'Comparação Anual');

  // Gerando o arquivo
  XLSX.writeFile(workbook, 'comparacao-clt-pj.xlsx');
};
