export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { password } = req.body;
  const MASTER_PASSWORD = "elpepe"; 

  if (password === MASTER_PASSWORD) {
    return res.status(200).json({ success: true, token: "adm_sessao_ativa" });
  }
  
  res.status(401).json({ success: false });
}
