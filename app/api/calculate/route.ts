import { NextResponse } from 'next/server';

interface CalculationData {
  cltSalary: number;
  pjSalary: number;
  benefits: number;
}

function calculateINSS(salary: number): number {
  // 2024 INSS table
  if (salary <= 1412) return salary * 0.075;
  if (salary <= 2666.68) return (salary * 0.09) - 21.18;
  if (salary <= 4000.03) return (salary * 0.12) - 101.18;
  if (salary <= 7786.02) return (salary * 0.14) - 181.18;
  return 877.24; // Maximum INSS contribution
}

function calculateIR(baseValue: number): number {
  // 2024 IR table
  if (baseValue <= 2112) return 0;
  if (baseValue <= 2826.65) return (baseValue * 0.075) - 158.40;
  if (baseValue <= 3751.05) return (baseValue * 0.15) - 370.40;
  if (baseValue <= 4664.68) return (baseValue * 0.225) - 651.73;
  return (baseValue * 0.275) - 884.96;
}

function calculatePJTaxes(salary: number): number {
  // Simplified calculation assuming Simples Nacional
  // This is an approximation and should be adjusted based on revenue bracket
  return salary * 0.06; // 6% tax rate for initial bracket
}

export async function POST(request: Request) {
  try {
    const data: CalculationData = await request.json();
    
    // CLT Calculations
    const monthlyInss = calculateINSS(data.cltSalary);
    const cltBaseForIR = data.cltSalary - monthlyInss;
    const monthlyIR = calculateIR(cltBaseForIR);
    
    // Monthly benefits
    const fgts = data.cltSalary * 0.08; // 8% FGTS
    const thirteenthProRata = data.cltSalary / 12; // 13th salary monthly proportion
    const vacationProRata = (data.cltSalary * 1.33) / 12; // Vacation + 1/3 monthly proportion
    
    const totalCLTBenefits = fgts + thirteenthProRata + vacationProRata + data.benefits;
    const cltNet = data.cltSalary - monthlyInss - monthlyIR + totalCLTBenefits;

    // PJ Calculations
    const pjTaxes = calculatePJTaxes(data.pjSalary);
    const pjNet = data.pjSalary - pjTaxes;

    return NextResponse.json({
      cltNet: cltNet.toFixed(2),
      pjNet: pjNet.toFixed(2),
      details: {
        clt: {
          grossSalary: data.cltSalary.toFixed(2),
          inss: monthlyInss.toFixed(2),
          ir: monthlyIR.toFixed(2),
          fgts: fgts.toFixed(2),
          thirteenth: thirteenthProRata.toFixed(2),
          vacation: vacationProRata.toFixed(2),
          benefits: data.benefits.toFixed(2),
          totalBenefits: totalCLTBenefits.toFixed(2),
        },
        pj: {
          grossSalary: data.pjSalary.toFixed(2),
          taxes: pjTaxes.toFixed(2),
        }
      }
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to calculate' },
      { status: 400 }
    );
  }
}
