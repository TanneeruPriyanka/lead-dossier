// Vercel serverless function.
// Keeps the Anthropic API key server-side -- the browser never sees it.
// Requires an ANTHROPIC_API_KEY environment variable set in the Vercel project settings.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set in this Vercel project\'s environment variables.' });
  }

  const { systemPrompt, url } = req.body || {};
  if (!systemPrompt || !url) {
    return res.status(400).json({ error: 'Missing systemPrompt or url in request body.' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        // Verify this is still the current model string in your Anthropic console before relying
        // on it long-term -- model IDs get superseded over time. See platform.claude.com/docs.
        model: 'claude-sonnet-5',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Research this company: ${url}` }],
        tools: [{ type: 'web_search_20250305', name: 'web_search' }]
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
}
