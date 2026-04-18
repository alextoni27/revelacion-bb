const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let gender;
  try {
    ({ gender } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Body inválido" }) };
  }

  if (gender !== "varon" && gender !== "mujer") {
    return { statusCode: 400, body: JSON.stringify({ error: "Género inválido" }) };
  }

  const store = getStore("votes");
  const votes = (await store.get("counts", { type: "json" })) ?? { varon: 0, mujer: 0 };
  votes[gender]++;
  await store.set("counts", JSON.stringify(votes));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(votes),
  };
};
