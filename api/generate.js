export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, sector, msg, city } = req.body;
  if (!name || !msg) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a world-class DOOH (Digital Out-of-Home) creative director. Generate exactly 3 distinct ad variants for a digital outdoor screen.

Business: ${name}
Sector: ${sector}
Message/Offer: ${msg}
City: ${city}

RESPOND WITH ONLY VALID JSON — no markdown, no backticks, no explanation:
{
  "variants": [
    {
      "label": "Short creative direction name (2-3 words)",
      "headline": "Max 4 bold words — punchy, immediate, readable at 10m",
      "subline": "Max 8 words — support the headline, include the key offer",
      "cta": "2-3 words action phrase",
      "bg_color": "#hex",
      "text_color": "#hex",
      "accent_color": "#hex",
      "mood": "bold | elegant | vibrant"
    }
  ]
}

Rules:
- Variant 1: Bold/modern — dark background, strong contrast
- Variant 2: Elegant/premium — refined palette, upscale feel
- Variant 3: Vibrant/friendly — warm energetic colors
- ALL text optimised for 10m outdoor readability
- Colors must be high-contrast always`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    let text = data.candidates[0].content.parts[0].text.trim();
    text = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
