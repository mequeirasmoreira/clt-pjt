describe('CLT vs PJ Calculator', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the calculator page', () => {
    cy.contains('Calculadora')
    cy.contains('CLT vs PJ')
  })

  it('should navigate through form steps', () => {
    // Passo 1: CLT
    cy.get('input[name="cltSalary"]').type('5000')
    cy.get('input[name="cltHoursPerDay"]').type('8')
    cy.get('input[name="cltDaysPerWeek"]').type('5')
    cy.contains('button', 'Próximo').click()

    // Passo 2: PJ
    cy.get('input[name="pjSalary"]').type('6000')
    cy.get('input[name="pjHoursPerDay"]').type('8')
    cy.get('input[name="pjDaysPerWeek"]').type('5')
    cy.contains('button', 'Próximo').click()

    // Passo 3: Comparação
    cy.contains('button', 'Calcular').click()

    // Verificar se os resultados são exibidos
    cy.contains('Resultado da Comparação')
  })

  it('should validate required fields', () => {
    // Tentar avançar sem preencher campos obrigatórios
    cy.contains('button', 'Próximo').click()
    cy.contains('Erro no preenchimento')
  })

  it('should handle numeric inputs correctly', () => {
    cy.get('input[name="cltSalary"]')
      .type('5000')
      .should('have.value', 'R$ 5.000,00')
  })
})
