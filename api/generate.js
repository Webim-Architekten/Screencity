export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, sector, msg, city } = req.body;
  if (!name || !msg) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `You are a world-class DOOH creative director. Generate exactly 3 distinct ad variants for a digital outdoor screen.

Business: ${name}
Sector: ${sector}
Message/Offer: ${msg}
City: ${city}

RESPOND WITH ONLY VALID JSON — no markdown, no backticks, no explanation:
{"variants":[{"label":"2-3 words","headline":"Max 4 bold words","subline":"Max 8 words with key offer","cta":"2-3 words","bg_color":"#hex","text_color":"#hex","accent_color":"#hex","mood":"bold"}]}

Rules:
- Variant 1: Bold/modern — dark background, strong contrast
- Variant 2: Elegant/premium — refined palette, upscale feel
- Variant 3: Vibrant/friendly — warm energetic colors
- High contrast colors always`
        }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    let text = data.choices[0].message.content.trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
