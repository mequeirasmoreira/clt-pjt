import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { cltSalary, pjSalary, benefits } = req.body;
  
    // Simulação de cálculos simples (pode ser refinado):
    const cltNet = parseFloat(cltSalary) + parseFloat(benefits) - 0.2 * cltSalary; // 20% de imposto
    const pjNet = parseFloat(pjSalary) - 0.15 * pjSalary; // 15% de impostos PJ
  
    res.status(200).json({ cltNet, pjNet });
  }
  