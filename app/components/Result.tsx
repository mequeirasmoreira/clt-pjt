import { motion } from 'framer-motion';
import { 
  Building2, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface TransportCosts {
  type: 'car' | 'public' | 'other';
  distance?: number;
  fuelPrice?: number;
  fuelEfficiency?: number;
  publicTransportCost?: number;
  otherCost?: number;
}

interface FormData {
  // Dados CLT
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
  
  // Dados PJ
  pjSalary: number;
  pjHoursPerDay: number;
  pjDaysPerWeek: number;
  pjVacationDays: number;
  pjHasThirteenth: boolean;
  pjTransportCosts: TransportCosts;
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

const Result = ({ data }: ResultProps) => {
  // Cálculos CLT
  const cltInss = data.cltSalary <= 1320 ? data.cltSalary * 0.075 
    : data.cltSalary <= 2571.29 ? data.cltSalary * 0.09
    : data.cltSalary <= 3856.94 ? data.cltSalary * 0.12
    : data.cltSalary <= 7507.49 ? data.cltSalary * 0.14
    : 7507.49 * 0.14;

  const cltFgts = data.hasFGTS ? data.cltSalary * 0.08 : 0;
  const cltBenefits = (data.healthInsurance || 0) + (data.mealAllowance || 0) + 
    (data.useTransportAllowance ? (data.transportAllowance || 0) : 0) + (data.otherBenefits || 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-8 flex items-center gap-2">
        <DollarSign className="w-8 h-8" />
        Resultado da Comparação
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 hover:shadow-md transition-all duration-200"
        >
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Regime CLT
          </h3>
          <div className="space-y-3 text-[hsl(var(--muted-foreground))]">
            <p>Salário Bruto Mensal: {formatCurrency(data.cltSalary)}</p>
            <p>INSS Mensal: {formatCurrency(cltInss)}</p>
            <p>FGTS Mensal: {formatCurrency(cltFgts)}</p>
            <p>Benefícios Mensais: {formatCurrency(cltBenefits)}</p>
            <p>13º Salário: {formatCurrency(data.cltSalary)}</p>
            <p>Férias + 1/3: {formatCurrency(data.cltSalary * 1.33)}</p>
            <p>Participação nos Lucros: {formatCurrency(data.profitValue)}</p>
            <p className="font-semibold text-[hsl(var(--foreground))]">Total Anual: {formatCurrency(data.cltSalary * 13.33 + data.profitValue + (cltBenefits * 12))}</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6 hover:shadow-md transition-all duration-200"
        >
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Regime PJ
          </h3>
          <div className="space-y-3 text-[hsl(var(--muted-foreground))]">
            <p>Valor Bruto Mensal: {formatCurrency(data.pjSalary)}</p>
            <p>Impostos Mensais: {formatCurrency(data.pjSalary * 0.11)}</p>
            <p>Custos de Transporte: {formatCurrency(data.pjTransportCosts.type === 'car' ? (data.pjTransportCosts.distance * data.pjTransportCosts.fuelPrice / data.pjTransportCosts.fuelEfficiency) : data.pjTransportCosts.publicTransportCost || data.pjTransportCosts.otherCost)}</p>
            <p>Plano de Saúde: {formatCurrency(data.pjHealthInsurance)}</p>
            <p>Custos de Alimentação: {formatCurrency(data.pjMealCosts)}</p>
            <p>Contador: {formatCurrency(data.pjAccountantCost)}</p>
            <p>Espaço de Trabalho: {formatCurrency(data.pjWorkspaceCost)}</p>
            <p>Equipamentos: {formatCurrency(data.pjEquipmentCost)}</p>
            <p>Provisão Férias: {formatCurrency(data.pjVacationDays * data.pjSalary / 30)}</p>
            <p>Provisão 13º: {formatCurrency(data.pjHasThirteenth ? data.pjSalary : 0)}</p>
            <p className="font-semibold text-[hsl(var(--foreground))]">Total Anual: {formatCurrency(data.pjSalary * 12)}</p>
          </div>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="border-t border-[hsl(var(--border))] pt-8"
      >
        <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Comparação Final
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-lg text-[hsl(var(--muted-foreground))]">Diferença Anual</span>
              <span className={`text-xl font-semibold flex items-center gap-1 ${data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
                {data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {formatCurrency(Math.abs(data.cltSalary * 12 - data.pjSalary * 12))}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg text-[hsl(var(--muted-foreground))]">Diferença Percentual</span>
              <span className={`text-xl font-semibold flex items-center gap-1 ${data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
                {data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {Math.abs(((data.cltSalary * 12 - data.pjSalary * 12) / (data.pjSalary * 12)) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-lg text-[hsl(var(--muted-foreground))]">Regime mais vantajoso</span>
            <ArrowRight className="w-5 h-5 mx-2" />
            <span className={`text-xl font-bold ${data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
              {data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? 'PJ' : 'CLT'}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 p-6 bg-[hsl(var(--muted))] rounded-lg border border-[hsl(var(--border))]"
      >
        <h4 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Observações Importantes
        </h4>
        <ul className="list-none space-y-3 text-[hsl(var(--muted-foreground))]">
          {[
            'Os cálculos são aproximados e podem variar dependendo de diversos fatores',
            'Considere também aspectos não financeiros como estabilidade e direitos trabalhistas',
            'Consulte um contador para análises mais detalhadas sobre sua situação específica',
            'Os impostos podem variar dependendo do seu faturamento e enquadramento'
          ].map((text, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Result;