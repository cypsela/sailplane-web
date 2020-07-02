import first from 'it-first';
import all from 'it-all';
import JSZip from 'jszip';

async function fileToBlob({content}) {
  return new Blob(await all(content));
}

async function dirToBlob(path, struct) {
  const zip = new JSZip();
  const root = path.split('/')[path.split('/').length - 1];

  await Promise.all([
    struct.map(async (item) => {
      const isDir = item.type === 'dir';

      const splitPath = item.path.split('/');
      splitPath[0] = root;
      const path = splitPath.join('/');
      const blob = isDir ? undefined : await fileToBlob(item);

      console.log(path);
      console.log(blob);

      zip.file(path, blob, {dir: isDir});
    }),
  ]);

  const data = await zip.generateAsync({type: 'blob'});
  console.log(data);
  return data;
}

export async function getBlobFromPath(sharedFs, path, ipfs) {
  const cid = await sharedFs.current.read(path);
  const struct = await all(ipfs.get(cid));

  return struct[0].type === 'dir'
    ? dirToBlob(path, struct)
    : fileToBlob(struct[0]);
}

// export async function getBlobFromPath(sharedFs, path, ipfs) {
//   const cid = await sharedFs.current.read(path);
//   const file = await first(ipfs.get(cid));
//   const fileContent = await all(file.content);
//   const blob = new Blob(fileContent);
//   return blob;
// }
