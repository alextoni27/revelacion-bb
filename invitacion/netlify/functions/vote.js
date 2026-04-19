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

  const authHeader = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const otherKey = gender === 'varon' ? 'mujer' : 'varon';

  try {
    // Use pipeline for atomic INCR + GET
    let pipeRes = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify([['INCR', gender], ['GET', otherKey]]),
    }).then(r => r.json());

    let votado = parseInt(pipeRes[0]?.result);

    // If INCR failed (wrong key type), delete key and retry
    if (isNaN(votado)) {
      await fetch(`${url}/del/${gender}`, { headers: { Authorization: `Bearer ${token}` } });
      pipeRes = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify([['INCR', gender], ['GET', otherKey]]),
      }).then(r => r.json());
      votado = parseInt(pipeRes[0]?.result) || 0;
    }

    const otro = parseInt(pipeRes[1]?.result) || 0;

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
