"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { NumericFormat } from 'react-number-format';
import { useForm } from 'react-hook-form';

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
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <span
          data-tooltip-id={`tooltip-${name}`}
          className="inline-block ml-1 text-gray-400 cursor-help"
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {formErrorsState.find(error => error.message.includes(name)) && (
        <p className="mt-1 text-sm text-red-600">{formErrorsState.find(error => error.message.includes(name))?.message}</p>
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
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Resumo dos dados preenchidos:</h4>
        <dl className="grid grid-cols-2 gap-2">
          {Object.entries(currentData).map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs text-gray-500">{key}</dt>
              <dd className="text-sm font-medium">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">R$</span>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm font-medium text-gray-700">{label}</label>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-sm font-medium ${
                currentStep === step.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Seção CLT */}
        {currentStep === 'clt' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Regime CLT</h2>
            
            {/* Alerta informativo sobre CLT */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Informações importantes</h3>
                  <div className="mt-2 text-sm text-blue-700">
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
                  <p className="mt-1 text-sm text-gray-500">
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Regime PJ</h2>

            {/* Alerta informativo sobre PJ */}
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Lembre-se</h3>
                  <div className="mt-2 text-sm text-yellow-700">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo de Transporte
                    <span
                      data-tooltip-id="tooltip-transport"
                      className="inline-block ml-1 text-gray-400 cursor-help"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="car">Carro</option>
                    <option value="public">Transporte Público</option>
                    <option value="other">Outro</option>
                  </select>
                  {formState.pjTransportCosts.type === 'car' && (
                    <>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Distância (km/dia)</label>
                        <NumericFormat
                          value={formState.pjTransportCosts.distance}
                          onValueChange={(values) => handleTransportChange('distance')(values.value)}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          placeholder="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço do combustível (R$/L)</label>
                        <NumericFormat
                          value={formState.pjTransportCosts.fuelPrice}
                          onValueChange={(values) => handleTransportChange('fuelPrice')(values.value)}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          allowNegative={false}
                          placeholder="5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Eficiência do combustível (km/L)</label>
                        <NumericFormat
                          value={formState.pjTransportCosts.fuelEfficiency}
                          onValueChange={(values) => handleTransportChange('fuelEfficiency')(values.value)}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          placeholder="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  {formState.pjTransportCosts.type === 'public' && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custo do transporte público (mensal)</label>
                      <NumericFormat
                        value={formState.pjTransportCosts.publicTransportCost}
                        onValueChange={(values) => handleTransportChange('publicTransportCost')(values.value)}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        allowNegative={false}
                        placeholder="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {formState.pjTransportCosts.type === 'other' && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Outro custo (mensal)</label>
                      <NumericFormat
                        value={formState.pjTransportCosts.otherCost}
                        onValueChange={(values) => handleTransportChange('otherCost')(values.value)}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        allowNegative={false}
                        placeholder="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="block w-full rounded-md border-gray-300 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

        {formErrorsState.length > 0 && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-medium text-red-600 mb-4">Erro no preenchimento</h3>
              <ul className="list-disc pl-5 mb-4">
                {formErrorsState.map((error, index) => (
                  <li key={index} className="text-gray-700">{error.message}</li>
                ))}
              </ul>
              <button
                onClick={() => setFormErrors([])}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Voltar
          </button>
        )}
        {currentStep === 'comparison' ? (
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
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <span>Calcular</span>
            <FiCheckCircle size={20} />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {currentStep === 'intro' ? 'Começar' : 'Próximo'}
          </button>
        )}
      </div>
      <div ref={useRef(null)} />
    </div>
  );
}