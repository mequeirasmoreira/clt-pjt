# CLT-PJ Comparator

Uma aplicação web para comparar os regimes de contratação CLT e PJ no Brasil, ajudando profissionais a tomar decisões informadas sobre suas carreiras.

## 🚀 Funcionalidades

- Comparação detalhada entre CLT e PJ
- Cálculo de benefícios e custos
- Interface intuitiva e amigável
- Persistência de dados
- Tooltips informativos
- Multi-etapas para melhor experiência

## 💻 Tecnologias

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Framer Motion](https://www.framer.com/motion/) - Animações
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [React Number Format](https://github.com/s-yadav/react-number-format) - Formatação de números

## 🏗️ Estrutura do Projeto

```
clt-pj/
├── app/
│   ├── components/
│   │   ├── Forms.tsx
│   │   └── __tests__/
│   │       └── Forms.test.tsx
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── styles/
└── package.json
```

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/clt-pj.git
```

2. Instale as dependências
```bash
cd clt-pj
npm install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🧪 Testes

Execute os testes com:
```bash
npm test
```

## 📊 Funcionalidades Detalhadas

### Regime CLT
- Salário base
- Benefícios:
  - Vale Refeição
  - Vale Transporte
  - Plano de Saúde
- Benefícios adicionais:
  - 13º salário
  - Férias
  - FGTS
  - Participação nos lucros

### Regime PJ
- Valor mensal
- Custos:
  - Transporte (carro/público/outro)
  - Plano de saúde
  - Alimentação
- Tipo de empresa:
  - MEI
  - Simples Nacional
  - Lucro Presumido
- Custos adicionais:
  - Contador
  - Espaço de trabalho
  - Equipamentos

## 🔒 Persistência de Dados

Os dados do formulário são salvos automaticamente no localStorage do navegador, permitindo que o usuário retorne posteriormente para continuar o preenchimento.

## 🎯 Roadmap

- [ ] Implementar visualização detalhada da comparação
- [ ] Adicionar exportação de resultados
- [ ] Melhorar feedback de validação
- [ ] Adicionar mais tooltips informativos
- [ ] Implementar temas claro/escuro

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Seu Nome - [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) pela excelente documentação
- [Tailwind CSS](https://tailwindcss.com/) pelo sistema de design incrível
- Todos os contribuidores que dedicaram tempo para melhorar este projeto

---

⭐️ Se este projeto te ajudou, considere dar uma estrela!
