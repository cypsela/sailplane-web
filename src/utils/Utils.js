import all from 'it-all';
import first from 'it-first';
import JSZip from 'jszip';
import {
  FiFile,
  FiLock,
  FiImage,
  FiMusic,
  FiVideo,
  FiArchive,
} from 'react-icons/fi';
import {FaFolder} from 'react-icons/fa';
import dayjs from 'dayjs';

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
  return new Blob(chunks);
}

async function dirToBlob(path, struct, handleUpdate) {
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
  const data = await zip.generateAsync({type: 'blob'});
  return data;
}

export async function getFileInfoFromCID(cid, ipfs) {
  return await first(ipfs.get(cid));
}

export async function getBlobFromPath(sharedFs, path, ipfs, handleUpdate) {
  const cid = await sharedFs.current.read(path);
  const struct = await all(ipfs.get(cid));

  return struct[0].type === 'dir'
    ? dirToBlob(path, struct, handleUpdate)
    : fileToBlob(struct[0], handleUpdate);
}

export async function getFilesFromFolderCID(ipfs, cid, handleUpdate) {
  const struct = await all(ipfs.get(cid));

  return struct;
}

export async function getBlobFromPathCID(cid, path, ipfs, handleUpdate) {
  const struct = await all(ipfs.get(cid));

  return struct[0].type === 'dir'
    ? dirToBlob(path, struct, handleUpdate)
    : fileToBlob(struct[0], handleUpdate);
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
  'wav',
  'ogg',
  'flac',
  'jpeg',
];

export function isFileExtensionSupported(fileExtension) {
  return supportedPreviewExtensions.includes(fileExtension.toLowerCase());
}

export async function sha256(str) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
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
  if (!snapshot.isDragging) return {};
  if (!snapshot.isDropAnimating) {
    return style;
  }

  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

export function getIconForPath(type, isEncrypted, filename) {
  const ext = getFileExtensionFromFilename(filename);

  let iconComponent = FiFile;

  if (isFileExtensionImage(ext)) {
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

  if (isEncrypted) {
    iconComponent = FiLock;
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

export function isFileExtensionImage(ext) {
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
    const ext = getFileExtensionFromFilename(name);

    if (isFileExtensionAudio(ext)) {
      audioCount++;
    }

    if (isFileExtensionImage(ext)) {
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

export function getPercent (numer, denom) {
  return Math.round((numer / denom) * 100)
}

export const isWebRTCSupported =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  window.RTCPeerConnection;
