export async function get({ params, request }) {
  const id = Number(params.id);

  if (id > 0 && id <= 500) {
    const response = await fetch(`/nft/${id}.json`);

    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      body: buffer,
      encoding: "binary",
    };
  }

  return new Response("No such token id: " + id, {
    status: 404,
    statusText: "Not found",
  });
}

export async function getStaticPaths() {}
