const first = require('it-first');
const all = require('it-all');

export async function getBlobFromPath(sharedFs, path, ipfs) {
  const cid = await sharedFs.current.read(path);
  const file = await first(ipfs.get(cid));
  const fileContent = await all(file.content);
  const blob = new Blob(fileContent);
  return blob;
}
