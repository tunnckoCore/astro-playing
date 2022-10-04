// import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
// import { getNftData } from './src/utils.js';

// export async function getNfts() {
//   let idx = 1;

//   const stream = fs.createWriteStream('./nfts.json');

//   stream.write('{"nfts":[');

//   for await (const _ of Array.from({ length: 500 }).fill(0)) {
//     const data = await getNftData(idx);
//     idx += 1;

//     stream.write(JSON.stringify(data) + (idx === 501 ? '' : ','));

//     console.log(data);
//   }

//   stream.write(']}');

//   // console.log(nfts);
// }

// getNfts();

/*
{
  id: 500,
  dna: '762bf1effa6290883ec12ccc60e6aea79238bbb2',
  name: 'Ether Logs #500',
  description: 'Hand-drawn Logs on Ethereum. Do you own your favorite log?',
  imageIpfs: 'ipfs://bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm/500.png',
  imageHttps: 'https://bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm.ipfs.cf-ipfs.com/500.png',
  imagePinata: 'https://alchemy.mypinata.cloud/ipfs/bafybeifxaxbipz6vnizbwjq4tgva2symq5m3dj3szqgnjtx6nvhxnob7cm/500.png',
  imageLocal: '/images/500.png',
  traits: { background: 'orange', ring: 'emerald', log: 'red' }
}

[Rarity Score for a Trait Value] = 1 / ([items with that Trait] / [items in Coll])
*/

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

export function withRarityScores(traitIndex, nfts) {
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

function sortByRarity(nfts, rarestFirst = true) {
  return nfts.sort((a, b) => {
    const rarityLeft = a.rarity.score;
    const rarityRight = b.rarity.score;

    return rarestFirst ? rarityRight - rarityLeft : rarityLeft - rarityRight;
  });
}

async function writeRanked() {
  const { traitIndex, nfts } = await getTraitIndex();
  const rankedNfts = withRarityScores(traitIndex, nfts);

  const rarestFirst = sortByRarity(rankedNfts, true);
  // const rarestLast = sortByRarity(rankedNfts, false);

  console.log(JSON.stringify(rarestFirst));
}

// writeRanked();
