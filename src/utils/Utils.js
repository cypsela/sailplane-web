import all from 'it-all';
import JSZip from 'jszip';

async function fileToBlob({content}) {
  return new Blob(await all(content));
}

async function dirToBlob(path, struct) {
  const zip = new JSZip();
  const root = path.split('/')[path.split('/').length - 1];

  await Promise.all(
    struct.map(async (item) => {
      const isDir = item.type === 'dir';

      const splitPath = item.path.split('/');
      splitPath[0] = root;
      const path = splitPath.join('/');
      const blob = isDir ? undefined : await fileToBlob(item);

      zip.file(path, blob, {dir: isDir});
    }),
  );
  const data = await zip.generateAsync({type: 'blob'});
  return data;
}

export async function getBlobFromPath(sharedFs, path, ipfs) {
  const cid = await sharedFs.current.read(path);
  const struct = await all(ipfs.get(cid));

  return struct[0].type === 'dir'
    ? dirToBlob(path, struct)
    : fileToBlob(struct[0]);
}

export async function getBlobFromPathCID(cid, path, ipfs) {
  const struct = await all(ipfs.get(cid));

  return struct[0].type === 'dir'
    ? dirToBlob(path, struct)
    : fileToBlob(struct[0]);
}

export function getFileExtensionFromFilename(filename) {
  const fileParts = filename.split('.');
  return fileParts[fileParts.length - 1];
}

export const supportedPreviewExtensions = [
  'jpg',
  'png',
  'gif',
  'mp3',
  'ogg',
  'flac',
  'jpeg',
];

export function isFileExtensionSupported(fileExtension) {
  return supportedPreviewExtensions.includes(fileExtension.toLowerCase());
}

export async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
  return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
}
