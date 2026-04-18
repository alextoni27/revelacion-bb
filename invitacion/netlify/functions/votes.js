const { getStore } = require("@netlify/blobs");

exports.handler = async function () {
  const store = getStore("votes");
  const votes = (await store.get("counts", { type: "json" })) ?? { varon: 0, mujer: 0 };
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(votes),
  };
};
