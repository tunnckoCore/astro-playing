export function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateItemForId(id, data) {
  return {
    id,
    title: "Ether Logs #" + id,
    image: `/images/${id}.png`,
    price: randInt(1, 444),
    rank: randInt(1, 30),
    isPage: false,
    ...data,
  };
}

export function generateItems(max) {
  const chosen = [];
  const items = Array(max).fill(0);

  return items;
}

// // https://ipfs.fleek.co/ipfs/bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm
// const chosen = [];
// const folder =
//   "https://cloudflare-ipfs.com/ipfs/bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm";

// export const getFakeItems = () =>
//   Array(54)
//     .fill(0)
//     .map(function reducer(x) {
//       let id = x === 0 ? rand(1, 500) : x;

//       if (chosen.includes(id)) {
//         return reducer(0);
//       }

//       chosen.push(id);

//       const price = rand(1.611, 100.123);
//       const num = new Intl.NumberFormat("en-US", {
//         style: "decimal",
//       }).format(price + 1.4234);

//       return {
//         id,
//         title: `Ether Logs #${id}`, /////xx
//         // name: `#${id}`,
//         image: `${folder}/${id}.png`,
//         src: `${folder}/${id}.png`,

//         price: num,

//         highestOffer: new Intl.NumberFormat("en-US", {
//           style: "decimal",
//         }).format(price - price / 3),

//         // between 15,000 - 35,000
//         views: new Intl.NumberFormat("en-US", {
//           style: "decimal",
//         }).format(rand(15000, 35000)),

//         // between 100 and 5500
//         sparkles: new Intl.NumberFormat("en-US", {
//           style: "decimal",
//         }).format(rand(100, 5500)),

//         // between 1 and 300
//         rank: new Intl.NumberFormat("en-US", {
//           style: "decimal",
//         }).format(rand(1, 300)),
//       };
//     });

/** When needed to re-scrape/fetch APIs */
// import { writeFile, mkdir } from "fs/promises";

// export async function getStaticPaths() {
// 	const url =
// 		"https://eth-mainnet.g.alchemy.com/nft/v2/JwqJabUlNej1aLoQQ8AY2iRr7yGxEdWs/getNFTsForCollection?contractAddress=0x12423f35fa1e2969c73586788090f24ba72a6a1e&withMetadata=true&startToken=";

// 	async function fetchPage(pageToken) {
// 		const pageNfts = [];

// 		const resp = await fetch(url + pageToken);
// 		const { nfts: nftsMeta } = await resp.json();
// 		const distDirname = path.dirname(new URL(import.meta.url).pathname);

// 		for await (const nft of nftsMeta) {
// 			// console.log({ nft });
// 			const parsedUrl = new URL(nft.tokenUri.gateway);
// 			parsedUrl.host = "gateway.ipfscdn.io";

// 			const nftDataUrl = parsedUrl.href;

// 			const {
// 				name,
// 				image,
// 				edition: id,
// 				attributes,
// 			} = await (await fetch(nftDataUrl)).json();

// 			const httpImageUrl = `https://gateway.ipfscdn.io/ipfs/${image.slice(7)}`;

// 			const outFileDir = path.join(distDirname, "assets", "nft");
// 			const outFilepath = path.join(outFileDir, `${id}.png`);

// 			await mkdir(outFileDir, { recursive: true });

// 			const response = await fetch(httpImageUrl);

// 			const blob = await response.blob();
// 			const stream = blob.stream();

// 			await writeFile(outFilepath, stream);
// 			// stream.pipe(fs.createWriteStream(outFilepath));

// 			console.log(outFilepath);

// 			pageNfts.push({ name, image, httpImage: httpImageUrl, id, attributes });
// 		}

// 		return pageNfts;
// 	}

// 	const nfts = await Promise.all([
// 		fetchPage(1), // page 1
// 		fetchPage(100), // page 2
// 		fetchPage(200), // page 3
// 		fetchPage(300), // page 4
// 		fetchPage(400), // page 5
// 	]);

// 	return nfts.flat().map((nft) => {
// 		return {
// 			props: { nft },
// 			params: { id: nft.id },
// 		};
// 	});
// }
