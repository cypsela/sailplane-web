import all from 'it-all';
import first from 'it-first';
import {
  FiArchive,
  FiFile,
  FiImage,
  FiLock,
  FiMusic,
  FiVideo,
} from 'react-icons/fi';
import {FaFolder} from 'react-icons/fa';
import dayjs from 'dayjs';
import detectIt from 'detect-it';
import secp256k1 from 'secp256k1';
import {Buffer} from 'safe-buffer';
import * as copy from 'copy-to-clipboard';
import {setStatus} from '../actions/tempData';

const bip39 = require('bip39');

export async function fileToBlob(file, handleUpdate) {
  const {content, size} = file;
  let chunks = [];
  let i = 0;
  const totalCount = Math.round(size / 250000);

  for await (const chunk of content) {
    if (handleUpdate) {
      handleUpdate(i, totalCount);
    }
    chunks.push(chunk);
    i++;
  }
  // eslint-disable-next-line no-undef
  return new Blob(chunks);
}

async function dirToBlob(path, struct, handleUpdate) {
  const {default: JSZip} = await import('jszip');
  const zip = new JSZip();
  const root = path.split('/')[path.split('/').length - 1];

  await Promise.all(
    struct.map(async (item) => {
      const isDir = item.type === 'dir';

      const splitPath = item.path.split('/');
      splitPath[0] = root;
      const path = splitPath.join('/');
      const blob = isDir ? undefined : await fileToBlob(item, handleUpdate);

      zip.file(path, blob, {dir: isDir});
    }),
  );
  return await zip.generateAsync({type: 'blob'});
}

export async function getFileInfoFromCID(cid, ipfs) {
  return await first(ipfs.get(cid));
}

export async function filePathToBlob(sharedFs, path, handleUpdate) {
  // const {content, size} = file;
  // let chunks = [];
  // let i = 0;
  // const totalCount = Math.round(size / 250000);
  //
  // for await (const chunk of content) {
  //   if (handleUpdate) {
  //     handleUpdate(i, totalCount);
  //   }
  //   chunks.push(chunk);
  //   i++;
  // }
  const chunks = await sharedFs.cat(path, {handleUpdate}).data();
  // eslint-disable-next-line no-undef
  return new Blob([chunks]);
}

async function dirPathToBlob(sharedFs, path, handleUpdate) {
  const struct = sharedFs.fs.tree(path).map((path) => {
    return {
      path,
      content:
        sharedFs.fs.content(path) !== 'dir' &&
        sharedFs.cat(path, {handleUpdate}),
    };
  });

  const {default: JSZip} = await import('jszip');
  const zip = new JSZip();

  await Promise.all(
    struct.map(async (item) => {
      const isDir = !item.content;
      const blob = isDir ? undefined : new Blob([await item.content.data()]);

      zip.file(item.path.replace(path + '/', ''), blob, {dir: isDir});
    }),
  );
  return await zip.generateAsync({type: 'blob'});
}

export async function getBlobFromPath(sharedFs, path, handleUpdate) {
  return sharedFs.fs.content(path) === 'dir'
    ? dirPathToBlob(sharedFs, path, handleUpdate)
    : filePathToBlob(sharedFs, path, handleUpdate);
}

export async function getFilesFromFolderCID(ipfs, cid, handleUpdate) {
  return await all(ipfs.get(cid));
}

export const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export async function getBlobFromPathCID(cid, path, ipfs, handleUpdate) {
  const struct = await all(ipfs.get(cid));

  return struct[0].type === 'dir'
    ? dirToBlob(path, struct, handleUpdate)
    : fileToBlob(struct[0], handleUpdate);
}

export function filenameExt(filename) {
  const fileParts = filename.split('.');
  return fileParts[fileParts.length - 1];
}

export const supportedPreviewExtensions = [
  'jpg',
  'png',
  'gif',
  'mp3',
  'wav',
  'ogg',
  'flac',
  'jpeg',
];

export function isFileExtensionSupported(fileExtension) {
  return supportedPreviewExtensions.includes(fileExtension.toLowerCase());
}

export async function sha256(str) {
  // eslint-disable-next-line no-undef
  const buf = await crypto.subtle.digest(
    'SHA-256',
    // eslint-disable-next-line no-undef
    new TextEncoder('utf-8').encode(str),
  );
  return Array.prototype.map
    .call(new Uint8Array(buf), (x) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

export function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + ' ' + units[u];
}

export function getDraggableStyleHack(style, snapshot) {
  if (!snapshot.isDragging) {
    return {};
  }

  if (!snapshot.isDropAnimating) {
    return style;
  }

  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

export function getIconForPath(type, filename) {
  const ext = filenameExt(filename);

  let iconComponent = FiFile;

  if (isImageFileExt(ext)) {
    iconComponent = FiImage;
  } else if (isFileExtensionAudio(ext)) {
    iconComponent = FiMusic;
  } else if (isFileExtensionVideo(ext)) {
    iconComponent = FiVideo;
  } else if (isFileExtensionArchive(ext)) {
    iconComponent = FiArchive;
  }

  if (type === 'dir') {
    iconComponent = FaFolder;
  }
  return iconComponent;
}

export const getFileTime = (unixTime) => {
  const dayObj = dayjs.unix(unixTime);
  if (dayObj.isBefore(dayjs().subtract(1, 'day'))) {
    return dayObj.format('MM/DD/YYYY');
  } else {
    return dayObj.format('h:mm a');
  }
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function isFileExtensionAudio(ext) {
  return ['mp3', 'wav', 'ogg', 'flac'].includes(ext.toLowerCase());
}

export function isImageFileExt(ext) {
  return ['jpg', 'jpeg', 'png', 'gif'].includes(ext.toLowerCase());
}

export function isFileExtensionVideo(ext) {
  return ['mp4', 'mov', 'flv', 'mpg', 'mpeg', 'avi'].includes(
    ext.toLowerCase(),
  );
}

export function isFileExtensionArchive(ext) {
  return ['zip', 'tar', 'gz', 'rar', '7z'].includes(ext.toLowerCase());
}

export function getShareTypeFromFolderFiles(files) {
  let audioCount = 0;
  let imageCount = 0;

  files.forEach((file) => {
    const pathSplit = file.path.split('/');
    const name = pathSplit[pathSplit.length - 1];
    const ext = filenameExt(name);

    if (isFileExtensionAudio(ext)) {
      audioCount++;
    }

    if (isImageFileExt(ext)) {
      imageCount++;
    }
  });

  const audioPercentage = getPercent(audioCount, files.length);
  const imagePercentage = getPercent(imageCount, files.length);

  if (audioPercentage > 60) {
    return 'audio';
  } else if (imagePercentage > 60) {
    return 'image';
  } else {
    return 'default';
  }
}

export function getPercent(numer, denom) {
  if (!denom) {
    return 0;
  }

  return Math.round((numer / denom) * 100);
}

export const isWebRTCSupported = () =>
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  window.RTCPeerConnection;

export const alphabetical = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());

export function sortDirectoryContents(directoryContents) {
  const sortedContents = directoryContents
    ? directoryContents.sort(({ name: a }, { name: b }) => alphabetical(a, b))
    : [];

  const directories = sortedContents.filter((item) => item.type === 'dir');
  const files = sortedContents.filter((item) => item.type !== 'dir');
  return directories.concat(files);
}

export const filterImageFiles = (files) =>
  files
    ? files.filter((file) => {
        const ext = filenameExt(file.name);
        return isImageFileExt(ext);
      })
    : null;

export const getMnemonic = () => {
  return bip39.generateMnemonic().split(' ').slice(0, 3).join('-');
};

export const jdenticonConfig = {
  hues: [211],
  lightness: {
    color: [0.4, 0.8],
    grayscale: [0.3, 0.9],
  },
  saturation: {
    color: 0.39,
    grayscale: 0.0,
  },
  backColor: '#86444400',
};

export const hasMouse = detectIt.hasMouse === true;

export function compressKey(uncompressedKey) {
  return Buffer.from(
    secp256k1.publicKeyConvert(Buffer.from(uncompressedKey, 'hex'), true),
  ).toString('hex');
}

export function decompressKey(compressedKey) {
  return Buffer.from(
    secp256k1.publicKeyConvert(Buffer.from(compressedKey, 'hex'), false),
  ).toString('hex');
}

export function publicKeyValid(publicKey) {
  try {
    return secp256k1.publicKeyVerify(Buffer.from(publicKey, 'hex'));
  } catch (e) {
    return false;
  }
}

export async function copyToClipboard(text) {
  copy(text);
  // await navigator.clipboard.writeText(text);
}

export const capitalize = (s) => {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function notify(text, dispatch, isError) {
  dispatch(
    setStatus({
      message: text,
      isInfo: true,
      isError,
    }),
  );
  setTimeout(() => dispatch(setStatus({})), 1500);
}

export function doesUserHaveWriteInInstance(sharedFS) {
  const {writers, admins, myID} = getInstanceAccessDetails(sharedFS);

  return writers.includes(myID) || admins.includes(myID);
}

export function getInstanceAccessDetails(sharedFS) {
  let tmpAdmins = sharedFS.access.admin;
  let tmpWriters = sharedFS.access.write;
  let tmpReaders = sharedFS.access.read;
  let tmpMyID = compressKey(sharedFS.identity.publicKey);

  tmpAdmins = Array.from(tmpAdmins).map((key) => compressKey(key));
  tmpWriters = Array.from(tmpWriters).map((key) => compressKey(key));

  tmpReaders = Array.from(tmpReaders)
    .map((key) => compressKey(key))
    .filter((key) => !tmpAdmins.includes(key))
    .filter((key) => !tmpWriters.includes(key));

  return {
    admins: tmpAdmins,
    writers: tmpWriters,
    readers: tmpReaders,
    myID: tmpMyID,
  };
}
