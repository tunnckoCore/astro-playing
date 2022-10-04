import { getNftData } from '../utils.js';

export async function get({ params, request }) {
  const id = Number(params.id);

  if (id > 0 && id <= 500) {
    const data = await getNftData(id);

    return { body: JSON.stringify(data) };
  }

  return new Response(
    JSON.stringify({
      error: `No such token id: ${id}`,
    }),
    {
      status: 404,
      statusText: 'Not found',
      headers: {
        'content-type': 'application/json',
      },
    },
  );
}

export async function getStaticPaths() {
  return [{ params: { id: 0 } }];
}
