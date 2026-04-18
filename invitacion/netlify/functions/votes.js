exports.handler = async function () {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  const [r1, r2] = await Promise.all([
    fetch(`${url}/get/varon`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    fetch(`${url}/get/mujer`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
  ]);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      varon: parseInt(r1.result) || 0,
      mujer: parseInt(r2.result) || 0,
    }),
  };
};
