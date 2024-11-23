"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiArrowLeft, FiArrowRight, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { NumericFormat } from 'react-number-format';
import { useForm } from 'react-hook-form';
import { exportToExcel } from '../utils/excelExport';

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

interface FormProps {
  onSubmit: (data: FormData) => void;
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-6">Resultado da Comparação</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Regime CLT</h3>
          <div className="space-y-2 text-[hsl(var(--muted-foreground))]">
            <p>Salário Bruto Mensal: R$&nbsp;{formatCurrency(data.cltSalary)}</p>
            <p>INSS Mensal: R$&nbsp;{formatCurrency(cltInss)}</p>
            <p>FGTS Mensal: R$&nbsp;{formatCurrency(cltFgts)}</p>
            <p>Benefícios Mensais: R$&nbsp;{formatCurrency(cltBenefits)}</p>
            <p>13º Salário: R$&nbsp;{formatCurrency(data.cltSalary)}</p>
            <p>Férias + 1/3: R$&nbsp;{formatCurrency(data.cltSalary)}</p>
            <p>Participação nos Lucros: R$&nbsp;{formatCurrency(data.profitValue)}</p>
            <p className="font-semibold text-[hsl(var(--foreground))]">Total Anual: R$&nbsp;{formatCurrency(data.cltSalary * 12)}</p>
          </div>
        </div>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6">
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Regime PJ</h3>
          <div className="space-y-2 text-[hsl(var(--muted-foreground))]">
            <p>Valor Bruto Mensal: R$&nbsp;{formatCurrency(data.pjSalary)}</p>
            <p>Impostos Mensais: R$&nbsp;{formatCurrency(data.pjSalary * 0.11)}</p>
            <p>Custos de Transporte: R$&nbsp;{formatCurrency(data.pjTransportCosts.type === 'car' ? (data.pjTransportCosts.distance * data.pjTransportCosts.fuelPrice / data.pjTransportCosts.fuelEfficiency) : data.pjTransportCosts.publicTransportCost || data.pjTransportCosts.otherCost)}</p>
            <p>Plano de Saúde: R$&nbsp;{formatCurrency(data.pjHealthInsurance)}</p>
            <p>Custos de Alimentação: R$&nbsp;{formatCurrency(data.pjMealCosts)}</p>
            <p>Contador: R$&nbsp;{formatCurrency(data.pjAccountantCost)}</p>
            <p>Espaço de Trabalho: R$&nbsp;{formatCurrency(data.pjWorkspaceCost)}</p>
            <p>Equipamentos: R$&nbsp;{formatCurrency(data.pjEquipmentCost)}</p>
            <p>Provisão Férias: R$&nbsp;{formatCurrency(data.pjVacationDays * data.pjSalary / 30)}</p>
            <p>Provisão 13º: R$&nbsp;{formatCurrency(data.pjSalary)}</p>
            <p className="font-semibold text-[hsl(var(--foreground))]">Total Anual: R$&nbsp;{formatCurrency(data.pjSalary * 12)}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--border))] pt-6">
        <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-4">Comparação Final</h3>
        <div className="space-y-4">
          <p className="text-lg text-[hsl(var(--muted-foreground))]">
            Diferença Anual: {' '}
            <span className={`font-semibold ${data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
              {data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? '+' : '-'}R$&nbsp;{formatCurrency(Math.abs(data.cltSalary * 12 - data.pjSalary * 12))}
            </span>
          </p>
          <p className="text-lg text-[hsl(var(--muted-foreground))]">
            Diferença Percentual: {' '}
            <span className={`font-semibold ${data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
              {data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? '+' : '-'}{Math.abs(((data.cltSalary * 12 - data.pjSalary * 12) / (data.pjSalary * 12)) * 100).toFixed(2)}%
            </span>
          </p>
          <p className="text-lg text-[hsl(var(--muted-foreground))]">
            Regime mais vantajoso: {' '}
            <span className="font-bold text-[hsl(var(--foreground))]">{data.cltSalary * 12 - data.pjSalary * 12 >= 0 ? 'PJ' : 'CLT'}</span>
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-[hsl(var(--muted))] p-4">
        <h4 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">Observações Importantes</h4>
        <ul className="list-disc pl-5 space-y-2 text-[hsl(var(--muted-foreground))]">
          <li>Os cálculos são aproximados e podem variar dependendo de diversos fatores</li>
          <li>Considere também aspectos não financeiros como estabilidade e direitos trabalhistas</li>
          <li>Consulte um contador para análises mais detalhadas sobre sua situação específica</li>
          <li>Os impostos podem variar dependendo do seu faturamento e enquadramento</li>
        </ul>
      </div>
    </div>
  );
};

export default function Form({ onSubmit }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    setValue
  } = useForm<FormData>();

  const [formErrorsState, setFormErrors] = useState<Array<{ message: string }>>([]);
  const [currentStep, setCurrentStep] = useState<'intro' | 'clt' | 'pj' | 'comparison'>('intro');
  const [progress, setProgress] = useState(0);
  const [formState, setFormState] = useState<FormData>(() => {
    // Tenta recuperar dados salvos do localStorage
    const savedData = localStorage.getItem('form_data');
    const initialData = savedData ? JSON.parse(savedData) : {
      // CLT
      cltSalary: 0,
      cltHoursPerDay: 8,
      cltDaysPerWeek: 5,
      healthInsurance: 0,
      healthInsuranceEmployee: 0,
      mealAllowance: 0,
      transportAllowance: 0,
      useTransportAllowance: false,
      otherBenefits: 0,
      hasThirteenth: true,
      hasVacation: true,
      hasFGTS: true,
      hasProfit: false,
      profitValue: 0,

      // PJ
      pjSalary: 0,
      pjHoursPerDay: 8,
      pjDaysPerWeek: 5,
      pjVacationDays: 30,
      pjHasThirteenth: false,
      pjTransportCosts: {
        type: 'car',
        distance: 0,
        fuelPrice: 0,
        fuelEfficiency: 0,
        publicTransportCost: 0,
        otherCost: 0
      },
      pjHealthInsurance: 0,
      pjMealCosts: 0,
      pjCompanyType: 'mei',
      pjHasAccountant: false,
      pjAccountantCost: 0,
      pjHasWorkspace: false,
      pjWorkspaceCost: 0,
      pjHasEquipment: false,
      pjEquipmentCost: 0
    };

    // Converte strings para números
    Object.keys(initialData).forEach(key => {
      if (typeof initialData[key] === 'string' && !isNaN(Number(initialData[key]))) {
        initialData[key] = Number(initialData[key]);
      }
    });

    return initialData;
  });

  // Salva o progresso automaticamente
  useEffect(() => {
    localStorage.setItem('form_data', JSON.stringify(formState));
  }, [formState]);

  const tooltips = {
    cltSalary: "Salário bruto mensal no regime CLT",
    healthInsurance: "Valor do plano de saúde oferecido pela empresa",
    mealAllowance: "Valor do vale refeição/alimentação mensal",
    transportAllowance: "Valor do vale transporte mensal",
    pjSalary: "Valor mensal cobrado como PJ",
    pjHealthInsurance: "Custo mensal do plano de saúde como PJ",
    pjMealCosts: "Gastos mensais estimados com alimentação",
    pjTransportCosts: "Gastos mensais estimados com transporte"
  };

  const renderMoneyInput = (name: string, label: string, tooltip: string) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">
        {label}
        <span
          data-tooltip-id={`tooltip-${name}`}
          className="inline-block ml-1 text-[hsl(var(--muted-foreground))] cursor-help"
        >
          <FiInfo size={16} />
        </span>
      </label>
      <Tooltip id={`tooltip-${name}`}>{tooltip}</Tooltip>
      <NumericFormat
        id={name}
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        defaultValue={formState[name]}
        onValueChange={(values) => {
          const { floatValue } = values;
          handleChange(name)(floatValue || 0);
        }}
        className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
      />
      {formErrorsState.find(error => error.message.includes(name)) && (
        <p className="mt-1 text-sm text-[hsl(var(--destructive))]">
          {formErrorsState.find(error => error.message.includes(name))?.message}
        </p>
      )}
    </div>
  );

  const renderStepSummary = () => {
    const currentData = currentStep === 'clt' ? {
      "Salário Bruto": formState.cltSalary,
      "Plano de Saúde": formState.healthInsurance,
      "Vale Refeição": formState.mealAllowance,
      "Vale Transporte": formState.transportAllowance
    } : {
      "Valor Mensal": formState.pjSalary,
      "Plano de Saúde": formState.pjHealthInsurance,
      "Custos Alimentação": formState.pjMealCosts,
      "Custos Transporte": formState.pjTransportCosts?.type === 'car' 
        ? `Carro - ${formState.pjTransportCosts.distance}km`
        : formState.pjTransportCosts?.type === 'public'
        ? 'Transporte Público'
        : 'Outro'
    };

    return (
      <div className="bg-[hsl(var(--muted))] p-4 rounded-lg mt-4">
        <h4 className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">Resumo dos dados preenchidos:</h4>
        <dl className="grid grid-cols-2 gap-2">
          {Object.entries(currentData).map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs text-[hsl(var(--muted-foreground))]">{key}</dt>
              <dd className="text-sm font-medium text-[hsl(var(--foreground))]">
                {typeof value === 'number' ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };

  const steps = [
    { id: 'intro', label: 'Introdução', progress: 0 },
    { id: 'clt', label: 'Dados CLT', progress: 33 },
    { id: 'pj', label: 'Dados PJ', progress: 66 },
    { id: 'comparison', label: 'Comparação', progress: 100 }
  ];

  const handleChange = (field: string) => (value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTransportChange = (field: string) => (value: string) => {
    setFormState(prev => ({
      ...prev,
      pjTransportCosts: {
        ...prev.pjTransportCosts,
        [field]: value
      }
    }));
  };

  const handleTransportTypeChange = (type: TransportCosts['type']) => {
    setFormState(prev => ({
      ...prev,
      pjTransportCosts: {
        type,
        distance: '',
        fuelPrice: '',
        fuelEfficiency: '',
        publicTransportCost: '',
        otherCost: ''
      }
    }));
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as any);
      setProgress(steps[currentIndex + 1].progress);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as any);
      setProgress(steps[currentIndex - 1].progress);
    }
  };

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSubmitForm = (data: FormData) => {
    onSubmit(data);
  };

  const InputField = ({ label, value, onChange, placeholder }: { 
    label: string; 
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">{label}</label>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-[hsl(var(--muted-foreground))] sm:text-sm">R$</span>
          </div>
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            value={value}
            onValueChange={(values) => {
              const { value } = values;
              onChange(value);
            }}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
      </div>
    );
  };

  const NumberField = ({ label, value, onChange, placeholder }: { 
    label: string; 
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">{label}</label>
        <div className="relative rounded-md shadow-sm">
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            value={value}
            onValueChange={(values) => {
              const { value } = values;
              onChange(value);
            }}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
      </div>
    );
  };

  const CheckboxField = ({ label, checked, onChange }: { 
    label: string; 
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => {
    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />
        <label className="ml-2 block text-sm font-medium text-[hsl(var(--foreground))]">{label}</label>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg shadow-md">
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-sm font-medium ${
                currentStep === step.id ? 'text-[hsl(var(--primary))] ' : 'text-[hsl(var(--muted-foreground))]'
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-[hsl(var(--muted))] rounded-full">
          <div
            className="h-full bg-[hsl(var(--primary))] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Seção CLT */}
        {currentStep === 'clt' && (
          <div className="bg-[hsl(var(--background))] p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-6">Regime CLT</h2>
            
            {/* Alerta informativo sobre CLT */}
            <div className="mb-6 bg-[hsl(var(--blue-50))] p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[hsl(var(--blue-400))]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[hsl(var(--blue-800))]">Informações importantes</h3>
                  <div className="mt-2 text-sm text-[hsl(var(--blue-700))]">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>O valor do plano de saúde deve ser o valor da tabela convencional</li>
                      <li>Informe o valor descontado em folha do plano de saúde</li>
                      <li>O vale transporte tem desconto de 6% do salário base</li>
                      <li>O vale refeição tem desconto de 20% do valor</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {renderMoneyInput('cltSalary', 'Salário Base CLT', tooltips.cltSalary)}
                <NumberField
                  label="Horas por dia"
                  value={formState.cltHoursPerDay}
                  onChange={handleChange('cltHoursPerDay')}
                  placeholder="8"
                />
                <NumberField
                  label="Dias por semana"
                  value={formState.cltDaysPerWeek}
                  onChange={handleChange('cltDaysPerWeek')}
                  placeholder="5"
                />
              </div>
              <div className="space-y-6">
                {renderMoneyInput('healthInsurance', 'Plano de Saúde (Empresa)', tooltips.healthInsurance)}
                <div className="relative">
                  <InputField
                    label="Plano de Saúde (Funcionário)"
                    value={formState.healthInsuranceEmployee}
                    onChange={handleChange('healthInsuranceEmployee')}
                    placeholder="200"
                  />
                  <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Valor descontado em folha
                  </p>
                </div>
                {renderMoneyInput('mealAllowance', 'Vale Refeição', tooltips.mealAllowance)}
                {renderMoneyInput('transportAllowance', 'Vale Transporte', tooltips.transportAllowance)}
                <CheckboxField
                  label="Utiliza Vale Transporte"
                  checked={formState.useTransportAllowance}
                  onChange={handleCheckboxChange('useTransportAllowance')}
                />
                <InputField
                  label="Outros Benefícios"
                  value={formState.otherBenefits}
                  onChange={handleChange('otherBenefits')}
                  placeholder="0"
                />
                <CheckboxField
                  label="Tem 13º Salário"
                  checked={formState.hasThirteenth}
                  onChange={handleCheckboxChange('hasThirteenth')}
                />
                <CheckboxField
                  label="Tem Férias"
                  checked={formState.hasVacation}
                  onChange={handleCheckboxChange('hasVacation')}
                />
                <CheckboxField
                  label="Tem FGTS"
                  checked={formState.hasFGTS}
                  onChange={handleCheckboxChange('hasFGTS')}
                />
                <CheckboxField
                  label="Tem Lucro"
                  checked={formState.hasProfit}
                  onChange={handleCheckboxChange('hasProfit')}
                />
                {formState.hasProfit && (
                  <InputField
                    label="Valor do Lucro"
                    value={formState.profitValue}
                    onChange={handleChange('profitValue')}
                    placeholder="1000"
                  />
                )}
              </div>
            </div>
            {renderStepSummary()}
          </div>
        )}

        {/* Seção PJ */}
        {currentStep === 'pj' && (
          <div className="bg-[hsl(var(--background))] p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-6">Regime PJ</h2>

            {/* Alerta informativo sobre PJ */}
            <div className="mb-6 bg-[hsl(var(--yellow-50))] p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[hsl(var(--yellow-400))]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[hsl(var(--yellow-800))]">Lembre-se</h3>
                  <div className="mt-2 text-sm text-[hsl(var(--yellow-700))]">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Como PJ, você precisa pagar seus próprios benefícios</li>
                      <li>Considere os custos reais de transporte (combustível, manutenção, etc.)</li>
                      <li>O plano de saúde particular geralmente é mais caro</li>
                      <li>Não esqueça de reservar para férias e 13º</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {renderMoneyInput('pjSalary', 'Valor Mensal PJ', tooltips.pjSalary)}
                <NumberField
                  label="Horas por dia"
                  value={formState.pjHoursPerDay}
                  onChange={handleChange('pjHoursPerDay')}
                  placeholder="8"
                />
                <NumberField
                  label="Dias por semana"
                  value={formState.pjDaysPerWeek}
                  onChange={handleChange('pjDaysPerWeek')}
                  placeholder="5"
                />
              </div>
              <div className="space-y-6">
                <NumberField
                  label="Dias de férias planejados"
                  value={formState.pjVacationDays}
                  onChange={handleChange('pjVacationDays')}
                  placeholder="30"
                />
                <CheckboxField
                  label="Planeja guardar para 13º"
                  checked={formState.pjHasThirteenth}
                  onChange={handleCheckboxChange('pjHasThirteenth')}
                />
                <div className="space-y-6">
                  <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">
                    Custo de Transporte
                    <span
                      data-tooltip-id="tooltip-transport"
                      className="inline-block ml-1 text-[hsl(var(--muted-foreground))] cursor-help"
                    >
                      <FiInfo size={16} />
                    </span>
                  </label>
                  <Tooltip id="tooltip-transport">
                    Selecione o tipo de transporte e preencha os custos relacionados
                  </Tooltip>
                  <select
                    value={formState.pjTransportCosts.type}
                    onChange={(e) => handleTransportTypeChange(e.target.value as TransportCosts['type'])}
                    className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  >
                    <option value="car">Carro</option>
                    <option value="public">Transporte Público</option>
                    <option value="other">Outro</option>
                  </select>
                  {formState.pjTransportCosts.type === 'car' && (
                    <>
                      <div className="relative">
                        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Distância (km/dia)</label>
                        <NumericFormat
                          value={formState.pjTransportCosts.distance}
                          onValueChange={(values) => handleTransportChange('distance')(values.value)}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          placeholder="100"
                          className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Preço do combustível (R$/L)</label>
                        <NumericFormat
                          value={formState.pjTransportCosts.fuelPrice}
                          onValueChange={(values) => handleTransportChange('fuelPrice')(values.value)}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          allowNegative={false}
                          placeholder="5"
                          className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Eficiência do combustível (km/L)</label>
                        <NumericFormat
                          value={formState.pjTransportCosts.fuelEfficiency}
                          onValueChange={(values) => handleTransportChange('fuelEfficiency')(values.value)}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          placeholder="10"
                          className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        />
                      </div>
                    </>
                  )}
                  {formState.pjTransportCosts.type === 'public' && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Custo do transporte público (mensal)</label>
                      <NumericFormat
                        value={formState.pjTransportCosts.publicTransportCost}
                        onValueChange={(values) => handleTransportChange('publicTransportCost')(values.value)}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        allowNegative={false}
                        placeholder="100"
                        className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      />
                    </div>
                  )}
                  {formState.pjTransportCosts.type === 'other' && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Outro custo (mensal)</label>
                      <NumericFormat
                        value={formState.pjTransportCosts.otherCost}
                        onValueChange={(values) => handleTransportChange('otherCost')(values.value)}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        allowNegative={false}
                        placeholder="100"
                        className="w-full px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      />
                    </div>
                  )}
                </div>
                {renderMoneyInput('pjHealthInsurance', 'Plano de Saúde PJ', tooltips.pjHealthInsurance)}
                {renderMoneyInput('pjMealCosts', 'Custo da Refeição PJ', tooltips.pjMealCosts)}
                <select
                  value={formState.pjCompanyType}
                  onChange={(e) => {
                    setFormState(prev => ({
                      ...prev,
                      pjCompanyType: e.target.value as FormData['pjCompanyType']
                    }));
                  }}
                  className="block w-full rounded-md border-[hsl(var(--border))] py-2 text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--ring))] sm:text-sm"
                >
                  <option value="mei">MEI</option>
                  <option value="simples">Simples</option>
                  <option value="lucro_presumido">Lucro Presumido</option>
                </select>
                <CheckboxField
                  label="Tem Contador"
                  checked={formState.pjHasAccountant}
                  onChange={handleCheckboxChange('pjHasAccountant')}
                />
                {formState.pjHasAccountant && (
                  <InputField
                    label="Custo do Contador"
                    value={formState.pjAccountantCost}
                    onChange={handleChange('pjAccountantCost')}
                    placeholder="500"
                  />
                )}
                <CheckboxField
                  label="Tem Espaço de Trabalho"
                  checked={formState.pjHasWorkspace}
                  onChange={handleCheckboxChange('pjHasWorkspace')}
                />
                {formState.pjHasWorkspace && (
                  <InputField
                    label="Custo do Espaço de Trabalho"
                    value={formState.pjWorkspaceCost}
                    onChange={handleChange('pjWorkspaceCost')}
                    placeholder="1000"
                  />
                )}
                <CheckboxField
                  label="Tem Equipamento"
                  checked={formState.pjHasEquipment}
                  onChange={handleCheckboxChange('pjHasEquipment')}
                />
                {formState.pjHasEquipment && (
                  <InputField
                    label="Custo do Equipamento"
                    value={formState.pjEquipmentCost}
                    onChange={handleChange('pjEquipmentCost')}
                    placeholder="500"
                  />
                )}
              </div>
            </div>
            {renderStepSummary()}
          </div>
        )}

        {currentStep === 'comparison' && (
          <div className="rounded-lg bg-[hsl(var(--card))] p-6 shadow-md">
            <Result data={formState} />
          </div>
        )}

        {formErrorsState.length > 0 && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-[hsl(var(--background))] bg-opacity-50 backdrop-blur-sm">
            <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium text-[hsl(var(--destructive))] mb-4">Erro no preenchimento</h3>
              <ul className="list-disc pl-5 mb-4">
                {formErrorsState.map((error, index) => (
                  <li key={index} className="text-[hsl(var(--foreground))]">{error.message}</li>
                ))}
              </ul>
              <button
                onClick={() => setFormErrors([])}
                className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded hover:opacity-90 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        {currentStep !== 'intro' && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            Voltar
          </button>
        )}
        {currentStep === 'comparison' ? (
          <div className="flex space-x-4">
            <button
              onClick={() => {
                // Validar todos os campos necessários
                const errors = [];
                
                // Validação CLT
                if (!formState.cltSalary) errors.push({ message: 'Informe o salário CLT' });
                if (!formState.cltHoursPerDay) errors.push({ message: 'Informe as horas por dia CLT' });
                if (!formState.cltDaysPerWeek) errors.push({ message: 'Informe os dias por semana CLT' });
                
                // Validação PJ
                if (!formState.pjSalary) errors.push({ message: 'Informe o valor PJ' });
                if (!formState.pjHoursPerDay) errors.push({ message: 'Informe as horas por dia PJ' });
                if (!formState.pjDaysPerWeek) errors.push({ message: 'Informe os dias por semana PJ' });
                
                if (errors.length > 0) {
                  setFormErrors(errors);
                  return;
                }
                
                // Se não houver erros, enviar os dados
                handleSubmitForm(formState);
              }}
              className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 transition-colors flex items-center space-x-2"
            >
              <span>Calcular</span>
              <FiCheckCircle size={20} />
            </button>
            <button
              onClick={() => exportToExcel(formState)}
              className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 transition-colors flex items-center space-x-2"
              data-tooltip-id="export-tooltip"
              data-tooltip-content="Exportar comparação para Excel"
            >
              <span>Exportar</span>
              <FiDownload size={20} />
            </button>
            <Tooltip id="export-tooltip" />
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 transition-colors"
          >
            {currentStep === 'intro' ? 'Começar' : 'Próximo'}
          </button>
        )}
      </div>
      <div ref={useRef(null)} />
    </div>
  );
}