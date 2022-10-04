import { readFile } from 'node:fs/promises';

export function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateItemForId(id, data) {
  return {
    id,
    title: `Ether Logs #${id}`,
    image: `/images/${id}.png`,
    price: randInt(1, 444),
    rank: randInt(1, 30),
    isPage: false,
    ...data,
  };
}

export function generateItems(max) {
  const chosen = [];
  const items = new Array(max).fill(0);

  return items;
}

export async function getTraitIndex() {
  const { nfts } = JSON.parse(await readFile('./nfts.json', 'utf8'));

  const traitIndex = { backgrounds: {}, rings: {}, logs: {} };

  for (const nft of nfts) {
    const { background: bg, ring, log } = nft.traits;

    traitIndex.backgrounds[bg] = traitIndex.backgrounds[bg] || 0;
    traitIndex.rings[ring] = traitIndex.rings[ring] || 0;
    traitIndex.logs[log] = traitIndex.logs[log] || 0;

    traitIndex.backgrounds[bg] += 1;
    traitIndex.rings[ring] += 1;
    traitIndex.logs[log] += 1;
  }

  traitIndex.backgroundsCount = Object.keys(traitIndex.backgrounds).length;
  traitIndex.ringsCount = Object.keys(traitIndex.rings).length;
  traitIndex.logsCount = Object.keys(traitIndex.logs).length;

  traitIndex.backgrounds = Object.fromEntries(
    Object.entries(traitIndex.backgrounds).sort(([, a], [, b]) => a - b),
  );
  traitIndex.rings = Object.fromEntries(
    Object.entries(traitIndex.rings).sort(([, a], [, b]) => a - b),
  );
  traitIndex.logs = Object.fromEntries(
    Object.entries(traitIndex.logs).sort(([, a], [, b]) => a - b),
  );

  // console.log(traitIndex);

  return { traitIndex, nfts };
}

// getTraitIndex();

export function withRarityScores(traitIndex, _nfts) {
  const nfts = _nfts.slice();
  let idx = 0;

  for (const nft of nfts) {
    const { background, ring, log } = nft.traits;
    const countWithThatBackground = traitIndex.backgrounds[background];
    const bgRarityScore = 1 / (countWithThatBackground / 500);

    const countWithThatRing = traitIndex.rings[ring];
    const ringRarityScore = 1 / (countWithThatRing / 500);

    const countWithThatLog = traitIndex.logs[log];
    const logRarityScore = 1 / (countWithThatLog / 500);

    nft.rarity = {
      background: bgRarityScore,
      ring: ringRarityScore,
      log: logRarityScore,
      score: bgRarityScore + ringRarityScore + logRarityScore,
    };

    nft.score = Number.parseFloat(
      (bgRarityScore + ringRarityScore + logRarityScore).toFixed(3),
    );

    // nft.score = new Intl.NumberFormat("en-US", {
    //   style: "decimal",
    // }).format(
    //   parseFloat((bgRarityScore + ringRarityScore + logRarityScore).toFixed(3))
    // );

    nfts[idx] = nft;
    idx += 1;
  }

  return nfts;
}

export function sortByRarity(nfts, rarestFirst = true) {
  return nfts.sort((a, b) => {
    const rarityLeft = a.rarity.score;
    const rarityRight = b.rarity.score;

    return rarestFirst ? rarityRight - rarityLeft : rarityLeft - rarityRight;
  });
}

const metaHash = 'bafybeidkmlh3m7j7zfxkoccbcalbnjm3s6yhx6ryrvw6xnlt7t6p5ro72u';
const imgHash = 'bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm';

// https://alchemy.mypinata.cloud/ipfs/{imgHash}/{tokenId}.png
// https://res.cloudinary.com/alchemyapi/image/upload/w_501,h_501/mainnet/89f674377bc8eb603c821365af7f9016.png
// https://alchemy.mypinata.cloud/ipfs/

const ALCHEMY_PINATA_IPFS = 'https://alchemy.mypinata.cloud/ipfs';
// const CONTRACT_ADDRESS = "0x12423f35fa1e2969c73586788090f24ba72a6a1e";

export async function getNftData(_id) {
  const id = Number(_id);

  if (id < 1 || id > 500) {
    return { error: `No such token id: ${_id}` };
  }

  let data = null;

  try {
    // data = await fetch(`https://${metaHash}.ipfs.cf-ipfs.com/${id}.json`);
    data = await fetch(`${ALCHEMY_PINATA_IPFS}/${metaHash}/${id}.json`);
  } catch (err) {
    console.log({ error: err });
    return { error: String(err) };
  }

  const {
    name,
    image: imageIpfs,
    dna,
    description,
    attributes,
  } = await data.json();

  const imageHttps = `https://${imgHash}.ipfs.cf-ipfs.com/${id}.png`;
  const imagePinata = `${ALCHEMY_PINATA_IPFS}/${imgHash}/${id}.png`;

  const [background, ring, log] = attributes;

  const mode = background.value.slice(0, 5);
  const color = background.value.slice(5).toLowerCase();

  return {
    id,
    dna,
    name,
    description,
    imageIpfs,
    imageHttps,
    imagePinata,
    imageLocal: `/images/${id}.png`,
    traits: {
      background: `${mode}-${color}`,
      ring: ring.value.slice(0, -4),
      log: log.value.slice(0, -3),
    },
  };
}

// // https://ipfs.fleek.co/ipfs/bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm
// const chosen = [];
// const folder =
//   "https://cloudflare-ipfs.com/ipfs/bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm";

/*

{
  "nfts": [
    {
      "contract": {
        "address": "0x12423f35fa1e2969c73586788090f24ba72a6a1e"
      },
      "id": {
        "tokenId": "0x0000000000000000000000000000000000000000000000000000000000000001",
        "tokenMetadata": {
          "tokenType": "ERC721"
        }
      },
      "title": "Ether Logs #1",
      "description": "Hand-drawn Logs on Ethereum. Do you own your favorite log?",
      "tokenUri": {
        "raw": "ipfs://bafybeidkmlh3m7j7zfxkoccbcalbnjm3s6yhx6ryrvw6xnlt7t6p5ro72u/1.json",
        "gateway": "https://ipfs.io/ipfs/bafybeidkmlh3m7j7zfxkoccbcalbnjm3s6yhx6ryrvw6xnlt7t6p5ro72u/1.json"
      },
      "media": [
        {
          "raw": "ipfs://bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm/1.png",
          "gateway": "https://ipfs.io/ipfs/bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm/1.png"
        }
      ],
      "metadata": {
        "date": 1659519007683,
        "image": "ipfs://bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm/1.png",
        "dna": "5312ad2c0b8db52768ce8cbd5e2b41f60465e206",
        "name": "Ether Logs #1",
        "description": "Hand-drawn Logs on Ethereum. Do you own your favorite log?",
        "edition": 1,
        "attributes": [
          {
            "value": "fadedPurple",
            "trait_type": "backGround"
          },
          {
            "value": "emeraldRing",
            "trait_type": "etherRing"
          },
          {
            "value": "emeraldLog",
            "trait_type": "etherLog"
          }
        ],
        "compiler": "HashLips Art Engine"
      },
      "timeLastUpdated": "2022-09-23T21:28:17.915Z",
      "contractMetadata": {
        "name": "Ether Logs",
        "symbol": "ETHL",
        "totalSupply": "500",
        "tokenType": "ERC721"
      }
    },
  ]
}
*/
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
// const url =
//   "https://eth-mainnet.g.alchemy.com/nft/v2/JwqJabUlNej1aLoQQ8AY2iRr7yGxEdWs/getNFTsForCollection?contractAddress=0x12423f35fa1e2969c73586788090f24ba72a6a1e&withMetadata=true&startToken=";

// async function fetchPage(pageToken) {
//   const pageNfts = [];

//   const resp = await fetch(url + pageToken);
//   const { nfts: nftsMeta } = await resp.json();
//   const distDirname = path.dirname(new URL(import.meta.url).pathname);

//   for await (const nft of nftsMeta) {
//   // console.log({ nft });
//   const parsedUrl = new URL(nft.tokenUri.gateway);
//   parsedUrl.host = "gateway.ipfscdn.io";

//   const nftDataUrl = parsedUrl.href;

//   const {
//   name,
//   image,
//   edition: id,
//   attributes,
//   } = await (await fetch(nftDataUrl)).json();

//   const httpImageUrl = `https://gateway.ipfscdn.io/ipfs/${image.slice(7)}`;

//   const outFileDir = path.join(distDirname, "assets", "nft");
//   const outFilepath = path.join(outFileDir, `${id}.png`);

//   await mkdir(outFileDir, { recursive: true });

//   const response = await fetch(httpImageUrl);

//   const blob = await response.blob();
//   const stream = blob.stream();

//   await writeFile(outFilepath, stream);
//   // stream.pipe(fs.createWriteStream(outFilepath));

//   console.log(outFilepath);

//   pageNfts.push({ name, image, httpImage: httpImageUrl, id, attributes });
//   }

//   return pageNfts;
// }

// const nfts = await Promise.all([
//   fetchPage(1), // page 1
//   fetchPage(100), // page 2
//   fetchPage(200), // page 3
//   fetchPage(300), // page 4
//   fetchPage(400), // page 5
// ]);

// return nfts.flat().map((nft) => {
//   return {
//   props: { nft },
//   params: { id: nft.id },
//   };
// });
// }
