interface ResultProps {
  data: {
    cltNet: string;
    pjNet: string;
    details: {
      clt: {
        grossSalary: string;
        inss: string;
        ir: string;
        fgts: string;
        thirteenth: string;
        vacation: string;
        benefits: string;
        totalBenefits: string;
      };
      pj: {
        grossSalary: string;
        taxes: string;
      };
    };
  };
}

export default function Result({ data }: ResultProps) {
  const { cltNet, pjNet, details } = data;
  const cltValue = parseFloat(cltNet);
  const pjValue = parseFloat(pjNet);
  const difference = Math.abs(cltValue - pjValue);
  const betterOption = cltValue > pjValue ? 'CLT' : 'PJ';
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resultado da Comparação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Regime CLT</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Salário Bruto:</span>
              <span className="font-medium">R$ {details.clt.grossSalary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">INSS:</span>
              <span className="font-medium text-red-600">- R$ {details.clt.inss}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IR:</span>
              <span className="font-medium text-red-600">- R$ {details.clt.ir}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">FGTS Mensal:</span>
              <span className="font-medium text-green-600">+ R$ {details.clt.fgts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">13º (Mensal):</span>
              <span className="font-medium text-green-600">+ R$ {details.clt.thirteenth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Férias (Mensal):</span>
              <span className="font-medium text-green-600">+ R$ {details.clt.vacation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Benefícios:</span>
              <span className="font-medium text-green-600">+ R$ {details.clt.benefits}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-bold">
                <span>Total Líquido:</span>
                <span className="text-lg">R$ {cltNet}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Regime PJ</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Valor Bruto:</span>
              <span className="font-medium">R$ {details.pj.grossSalary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impostos (Simples):</span>
              <span className="font-medium text-red-600">- R$ {details.pj.taxes}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-bold">
                <span>Total Líquido:</span>
                <span className="text-lg">R$ {pjNet}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ 
        backgroundColor: betterOption === 'CLT' ? '#f0fdf4' : '#fdf2f8',
        borderColor: betterOption === 'CLT' ? '#86efac' : '#fbcfe8',
        borderWidth: '1px'
      }}>
        <h4 className="text-lg font-semibold mb-2">Conclusão</h4>
        <p>
          O regime <strong>{betterOption}</strong> é mais vantajoso financeiramente, 
          com uma diferença de <strong>R$ {difference.toFixed(2)}</strong> por mês.
        </p>
        {betterOption === 'CLT' && (
          <p className="mt-2 text-sm text-gray-600">
            Além disso, o regime CLT oferece mais segurança e benefícios garantidos por lei.
          </p>
        )}
        {betterOption === 'PJ' && (
          <p className="mt-2 text-sm text-gray-600">
            Lembre-se de considerar que como PJ você precisará gerenciar seus próprios benefícios e garantias.
          </p>
        )}
      </div>
    </div>
  );
}