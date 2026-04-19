exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let gender;
  try {
    ({ gender } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Body inválido' }) };
  }

  if (gender !== 'varon' && gender !== 'mujer') {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Género inválido' }) };
  }

  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Variables de entorno no configuradas' }) };
  }

  try {
    const otherKey = gender === 'varon' ? 'mujer' : 'varon';

    const [incrRes, otherRes] = await Promise.all([
      fetch(`${url}/incr/${gender}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${url}/get/${otherKey}`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]);

    const votado = parseInt(incrRes.result) || 0;
    const otro   = parseInt(otherRes.result) || 0;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        varon: gender === 'varon' ? votado : otro,
        mujer: gender === 'mujer' ? votado : otro,
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err.message }) };
  }
};
