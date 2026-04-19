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
    await fetch(`${url}/incr/${gender}`, { headers: { Authorization: `Bearer ${token}` } });

    const [r1, r2] = await Promise.all([
      fetch(`${url}/get/varon`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${url}/get/mujer`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        varon: parseInt(r1.result) || 0,
        mujer: parseInt(r2.result) || 0,
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err.message }) };
  }
};
