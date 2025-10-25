// worker.js — AI Diwan via ChatAnywhere
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return cors();

    if (url.pathname === '/generate' && req.method === 'POST') {
      const { name = 'روان', mode = 'classic', words = 60 } = await req.json().catch(() => ({}));

      const system = 'أنت شاعر عربي يكتب مقطعًا قصيرًا واضحًا. لغة فصيحة معاصرة. 3–4 أسطر.';
      const style = ({
        calm: 'هدوء ولغة مباشرة.',
        pledge: 'محور النص العهد والالتزام.',
        velvet: 'نعومة وإيقاع لطيف.',
        classic: 'نَفَس رومانسي رشيق بلا حشو.'
      }[mode]) || '';

      const body = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `اكتب 3–4 أسطر إلى ${name}. ${style} طول تقريبي ${words} كلمة. دون مقدمة أو خاتمة.` }
        ],
        temperature: 0.8,
        max_tokens: 220
      };

      const r = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CHATANYWHERE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await r.json();
      if (!r.ok) return json({ error: 'upstream_error', detail: data }, 502);

      const text = data?.choices?.[0]?.message?.content?.trim() || '';
      return json({ text });
    }

    return new Response('Not Found', { status: 404 });
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}
function cors() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
}
