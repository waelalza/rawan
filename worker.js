// worker.js — AI Diwan (poem generator)
const UPSTREAM = 'https://api.chatanywhere.tech/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return cors();

    if (url.pathname === '/generate' && req.method === 'POST') {
      const { name = 'Rawan', mode = 'classic', words = 60 } = await req.json().catch(()=>({}));

      const style = ({
        calm:'soft and emotional tone.',
        pledge:'about loyalty and love promise.',
        velvet:'gentle, smooth, romantic.',
        classic:'poetic, balanced, old Arabic style.'
      }[mode]) || '';

      const body = {
        model: MODEL,
        messages: [
          { role:'system', content:'You are an Arabic poet writing 3–4 modern romantic lines.' },
          { role:'user', content:`Write 3–4 poetic lines to ${name} in Arabic, ${style}, about love, ${words} words.` }
        ],
        temperature: 0.8,
        max_tokens: 220
      };

      const r = await fetch(UPSTREAM, {
        method:'POST',
        headers:{
          'Authorization': `Bearer ${env.CHATANYWHERE_API_KEY}`,
          'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await r.json().catch(()=> ({}));
      const text = data?.choices?.[0]?.message?.content?.trim() || '...';
      return json({ text });
    }

    return new Response('Not Found', { status:404 });
  }
};

function json(obj, status=200){
  return new Response(JSON.stringify(obj), {
    status,
    headers:{
      'Content-Type':'application/json; charset=utf-8',
      'Access-Control-Allow-Origin':'*'
    }
  });
}
function cors(){ return new Response(null,{status:204,headers:{
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'Content-Type, Authorization',
  'Access-Control-Allow-Methods':'POST, OPTIONS'
}}); }
