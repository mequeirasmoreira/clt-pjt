import { render, screen, fireEvent } from '@testing-library/react'
import Forms from '../Forms'

describe('Forms Component', () => {
  it('should render the form title', () => {
    render(<Forms onSubmit={() => {}} />)
    
    expect(screen.getByText('Introdução')).toBeInTheDocument()
    expect(screen.getByText('Dados CLT')).toBeInTheDocument()
    expect(screen.getByText('Dados PJ')).toBeInTheDocument()
  })

  it('should start with intro step', () => {
    render(<Forms onSubmit={() => {}} />)
    
    expect(screen.getByText('Começar')).toBeInTheDocument()
  })

  it('should handle CLT salary input', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Avança para o passo CLT
    fireEvent.click(screen.getByText('Começar'))
    
    const salaryInput = screen.getByLabelText('Salário Base CLT')
    fireEvent.change(salaryInput, { target: { value: '5000' } })
    
    // Verifica o valor formatado
    expect(salaryInput).toHaveValue('R$ 5.000')
  })

  it('should navigate to PJ step', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Avança para o passo CLT
    fireEvent.click(screen.getByText('Começar'))
    
    // Preenche dados CLT
    const cltSalaryInput = screen.getByLabelText('Salário Base CLT')
    fireEvent.change(cltSalaryInput, { target: { value: '5000' } })
    
    // Avança para o passo PJ
    fireEvent.click(screen.getByText('Próximo'))
    
    // Verifica se está no passo PJ
    expect(screen.getByText('Regime PJ')).toBeInTheDocument()
  })

  it('should handle CLT benefits inputs', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Avança para o passo CLT
    fireEvent.click(screen.getByText('Começar'))
    
    // Testa inputs de benefícios
    const healthInsuranceInput = screen.getByLabelText('Plano de Saúde (Empresa)')
    fireEvent.change(healthInsuranceInput, { target: { value: '500' } })
    expect(healthInsuranceInput).toHaveValue('R$ 500')
    
    const mealAllowanceInput = screen.getByLabelText('Vale Refeição')
    fireEvent.change(mealAllowanceInput, { target: { value: '800' } })
    expect(mealAllowanceInput).toHaveValue('R$ 800')
  })

  it('should handle PJ salary input', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o passo PJ
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Testa input de salário PJ
    const pjSalaryInput = screen.getByLabelText('Valor Mensal PJ')
    fireEvent.change(pjSalaryInput, { target: { value: '7000' } })
    expect(pjSalaryInput).toHaveValue('R$ 7.000')
  })

  it('should handle back navigation', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Avança para o passo CLT
    fireEvent.click(screen.getByText('Começar'))
    expect(screen.getByText('Regime CLT')).toBeInTheDocument()
    
    // Avança para o passo PJ
    fireEvent.click(screen.getByText('Próximo'))
    expect(screen.getByText('Regime PJ')).toBeInTheDocument()
    
    // Volta para o passo CLT
    fireEvent.click(screen.getByText('Voltar'))
    expect(screen.getByText('Regime CLT')).toBeInTheDocument()
  })

  it('should handle form submission', () => {
    const mockSubmit = jest.fn()
    render(<Forms onSubmit={mockSubmit} />)
    
    // Preenche todo o formulário
    fireEvent.click(screen.getByText('Começar'))
    
    // Dados CLT
    fireEvent.change(screen.getByLabelText('Salário Base CLT'), { target: { value: '5000' } })
    fireEvent.click(screen.getByText('Próximo'))
    
    // Dados PJ
    fireEvent.change(screen.getByLabelText('Valor Mensal PJ'), { target: { value: '7000' } })
    
    // Avança para o passo de comparação
    fireEvent.click(screen.getByText('Próximo'))
    
    // Clica no botão calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }))
    
    expect(mockSubmit).toHaveBeenCalled()
  })

  it('should handle CLT checkbox inputs', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Avança para o passo CLT
    fireEvent.click(screen.getByText('Começar'))
    
    // Testa checkboxes
    const useTransportCheckbox = screen.getByLabelText('Utiliza Vale Transporte')
    fireEvent.click(useTransportCheckbox)
    expect(useTransportCheckbox).toBeChecked()
    
    const thirteenthCheckbox = screen.getByLabelText('Tem 13º Salário')
    fireEvent.click(thirteenthCheckbox)
    expect(thirteenthCheckbox).not.toBeChecked()
    
    const vacationCheckbox = screen.getByLabelText('Tem Férias')
    fireEvent.click(vacationCheckbox)
    expect(vacationCheckbox).not.toBeChecked()
  })

  it('should handle PJ transport type selection', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o passo PJ
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Seleciona tipo de transporte
    const transportSelect = screen.getByLabelText('Custo de Transporte')
    fireEvent.change(transportSelect, { target: { value: 'public' } })
    
    // Verifica se o input de transporte público aparece
    expect(screen.getByLabelText('Custo do transporte público (mensal)')).toBeInTheDocument()
    
    // Muda para carro
    fireEvent.change(transportSelect, { target: { value: 'car' } })
    
    // Verifica se os inputs de carro aparecem
    expect(screen.getByLabelText('Distância (km/dia)')).toBeInTheDocument()
    expect(screen.getByLabelText('Preço do combustível (R$/L)')).toBeInTheDocument()
    expect(screen.getByLabelText('Eficiência do combustível (km/L)')).toBeInTheDocument()
  })

  it('should handle PJ company type selection', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o passo PJ
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Seleciona tipo de empresa
    const companySelect = screen.getByRole('combobox')
    fireEvent.change(companySelect, { target: { value: 'simples' } })
    expect(companySelect).toHaveValue('simples')
    
    fireEvent.change(companySelect, { target: { value: 'lucro_presumido' } })
    expect(companySelect).toHaveValue('lucro_presumido')
  })

  it('should handle PJ additional costs inputs', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o passo PJ
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Habilita custos adicionais
    const accountantCheckbox = screen.getByLabelText('Tem Contador')
    fireEvent.click(accountantCheckbox)
    expect(accountantCheckbox).toBeChecked()
    
    // Preenche custo do contador
    const accountantCostInput = screen.getByLabelText('Custo do Contador')
    fireEvent.change(accountantCostInput, { target: { value: '500' } })
    expect(accountantCostInput).toHaveValue('R$ 500')
    
    // Habilita espaço de trabalho
    const workspaceCheckbox = screen.getByLabelText('Tem Espaço de Trabalho')
    fireEvent.click(workspaceCheckbox)
    expect(workspaceCheckbox).toBeChecked()
    
    // Preenche custo do espaço
    const workspaceCostInput = screen.getByLabelText('Custo do Espaço de Trabalho')
    fireEvent.change(workspaceCostInput, { target: { value: '1000' } })
    expect(workspaceCostInput).toHaveValue('R$ 1.000')
  })

  it('should handle validation errors', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o último passo sem preencher dados obrigatórios
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Tenta calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }))
    
    // Verifica mensagens de erro
    expect(screen.getByText('Erro no preenchimento')).toBeInTheDocument()
    expect(screen.getByText('Informe o salário CLT')).toBeInTheDocument()
    expect(screen.getByText('Informe o valor PJ')).toBeInTheDocument()
    
    // Fecha o modal de erro
    fireEvent.click(screen.getByText('Entendi'))
    expect(screen.queryByText('Erro no preenchimento')).not.toBeInTheDocument()
  })

  it('should handle form validation errors', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o último passo sem preencher campos obrigatórios
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Tenta calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }))
    
    // Verifica mensagens de erro
    const errorModal = screen.getByRole('dialog')
    expect(errorModal).toBeInTheDocument()
    expect(screen.getByText(/informe o salário clt/i)).toBeInTheDocument()
    expect(screen.getByText(/informe as horas por dia clt/i)).toBeInTheDocument()
    expect(screen.getByText(/informe os dias por semana clt/i)).toBeInTheDocument()
    expect(screen.getByText(/informe o valor pj/i)).toBeInTheDocument()
    expect(screen.getByText(/informe as horas por dia pj/i)).toBeInTheDocument()
    expect(screen.getByText(/informe os dias por semana pj/i)).toBeInTheDocument()
    
    // Fecha o modal de erro
    fireEvent.click(screen.getByRole('button', { name: /entendi/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should handle PJ transport costs calculations', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o passo PJ
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Seleciona transporte tipo carro
    const transportSelect = screen.getByRole('combobox', { name: /custo de transporte/i })
    fireEvent.change(transportSelect, { target: { value: 'car' } })
    
    // Preenche dados do carro
    fireEvent.change(screen.getByRole('spinbutton', { name: /distância/i }), { target: { value: '50' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /preço do combustível/i }), { target: { value: '5' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /eficiência do combustível/i }), { target: { value: '10' } })
    
    // Muda para transporte público
    fireEvent.change(transportSelect, { target: { value: 'public' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /custo do transporte público/i }), { target: { value: '200' } })
    
    // Muda para outro
    fireEvent.change(transportSelect, { target: { value: 'other' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /outro custo/i }), { target: { value: '300' } })
  })

  it('should handle CLT profit sharing input', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Avança para o passo CLT
    fireEvent.click(screen.getByText('Começar'))
    
    // Habilita participação nos lucros
    const profitCheckbox = screen.getByRole('checkbox', { name: /tem lucro/i })
    fireEvent.click(profitCheckbox)
    expect(profitCheckbox).toBeChecked()
    
    // Verifica se o input de valor aparece
    const profitInput = screen.getByRole('spinbutton', { name: /valor do lucro/i })
    expect(profitInput).toBeInTheDocument()
    
    // Preenche o valor
    fireEvent.change(profitInput, { target: { value: '2000' } })
    expect(profitInput).toHaveValue(2000)
    
    // Desabilita participação nos lucros
    fireEvent.click(profitCheckbox)
    expect(screen.queryByRole('spinbutton', { name: /valor do lucro/i })).not.toBeInTheDocument()
  })

  it('should handle PJ equipment costs', () => {
    render(<Forms onSubmit={() => {}} />)
    
    // Navega até o passo PJ
    fireEvent.click(screen.getByText('Começar'))
    fireEvent.click(screen.getByText('Próximo'))
    
    // Habilita custos de equipamento
    const equipmentCheckbox = screen.getByRole('checkbox', { name: /tem equipamento/i })
    fireEvent.click(equipmentCheckbox)
    expect(equipmentCheckbox).toBeChecked()
    
    // Preenche custo do equipamento
    const equipmentCostInput = screen.getByRole('spinbutton', { name: /custo do equipamento/i })
    fireEvent.change(equipmentCostInput, { target: { value: '5000' } })
    expect(equipmentCostInput).toHaveValue(5000)
    
    // Desabilita custos de equipamento
    fireEvent.click(equipmentCheckbox)
    expect(screen.queryByRole('spinbutton', { name: /custo do equipamento/i })).not.toBeInTheDocument()
  })

  it('should handle complete form submission with all fields', () => {
    const mockSubmit = jest.fn()
    render(<Forms onSubmit={mockSubmit} />)
    
    // Preenche todo o formulário
    fireEvent.click(screen.getByText('Começar'))
    
    // Dados CLT
    fireEvent.change(screen.getByRole('spinbutton', { name: /salário base clt/i }), { target: { value: '5000' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /horas por dia/i }), { target: { value: '8' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /dias por semana/i }), { target: { value: '5' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /plano de saúde \(empresa\)/i }), { target: { value: '500' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /plano de saúde \(funcionário\)/i }), { target: { value: '200' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /vale refeição/i }), { target: { value: '800' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /vale transporte/i }), { target: { value: '300' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /utiliza vale transporte/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /tem lucro/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /valor do lucro/i }), { target: { value: '2000' } })
    
    fireEvent.click(screen.getByText('Próximo'))
    
    // Dados PJ
    fireEvent.change(screen.getByRole('spinbutton', { name: /valor mensal pj/i }), { target: { value: '7000' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /horas por dia/i }), { target: { value: '8' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /dias por semana/i }), { target: { value: '5' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /dias de férias planejados/i }), { target: { value: '30' } })
    
    // Transporte PJ
    const transportSelect = screen.getByRole('combobox', { name: /custo de transporte/i })
    fireEvent.change(transportSelect, { target: { value: 'car' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /distância/i }), { target: { value: '50' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /preço do combustível/i }), { target: { value: '5' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /eficiência do combustível/i }), { target: { value: '10' } })
    
    // Outros custos PJ
    fireEvent.change(screen.getByRole('spinbutton', { name: /plano de saúde pj/i }), { target: { value: '800' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /custo da refeição pj/i }), { target: { value: '1000' } })
    
    const companySelect = screen.getByRole('combobox', { name: /tipo de empresa/i })
    fireEvent.change(companySelect, { target: { value: 'simples' } })
    
    fireEvent.click(screen.getByRole('checkbox', { name: /tem contador/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /custo do contador/i }), { target: { value: '500' } })
    
    fireEvent.click(screen.getByRole('checkbox', { name: /tem espaço de trabalho/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /custo do espaço de trabalho/i }), { target: { value: '1000' } })
    
    fireEvent.click(screen.getByRole('checkbox', { name: /tem equipamento/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /custo do equipamento/i }), { target: { value: '5000' } })
    
    fireEvent.click(screen.getByText('Próximo'))
    
    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: /calcular/i }))
    
    // Verifica se a função onSubmit foi chamada com todos os dados
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      cltSalary: 5000,
      cltHoursPerDay: 8,
      cltDaysPerWeek: 5,
      healthInsurance: 500,
      healthInsuranceEmployee: 200,
      mealAllowance: 800,
      transportAllowance: 300,
      useTransportAllowance: true,
      hasProfit: true,
      profitValue: 2000,
      pjSalary: 7000,
      pjHoursPerDay: 8,
      pjDaysPerWeek: 5,
      pjVacationDays: 30,
      pjTransportCosts: {
        type: 'car',
        distance: 50,
        fuelPrice: 5,
        fuelEfficiency: 10
      },
      pjHealthInsurance: 800,
      pjMealCosts: 1000,
      pjCompanyType: 'simples',
      pjHasAccountant: true,
      pjAccountantCost: 500,
      pjHasWorkspace: true,
      pjWorkspaceCost: 1000,
      pjHasEquipment: true,
      pjEquipmentCost: 5000
    }))
  })
})
