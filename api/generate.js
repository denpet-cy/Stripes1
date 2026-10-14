export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: 'Ontbrekende REPLICATE_API_TOKEN in Vercel instellingen.' });
  }

  const { prompt } = req.body;
  const finalPrompt = `A profile picture avatar of a zebra in cyberpunk neon style, vibrant neon glow, futuristic cyberpunk aesthetic, high tech, sharp vector art, ${prompt || ''}`;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "black-forest-labs/flux-schnell",
        input: { prompt: finalPrompt }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ error: data.detail || JSON.stringify(data) });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
