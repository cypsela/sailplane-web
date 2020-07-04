import {getFileExtensionFromFilename, sha256} from './Utils';

const pbkdf2iterations = 10000;
const sailplaneExtension = 'encrypted-sailplane';

function readfile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });
}

export const encryptFile = async (file, password) => {
  let plaintextbytes = await readfile(file).catch(function (err) {
    console.error(err);
  });

  plaintextbytes = new Uint8Array(plaintextbytes);

  const passphrasebytes = new TextEncoder('utf-8').encode(password);
  const pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));

  const passphrasekey = await window.crypto.subtle
    .importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
    .catch(function (err) {
      console.error(err);
    });
  console.log('passphrasekey imported');

  let pbkdf2bytes = await window.crypto.subtle
    .deriveBits(
      {
        name: 'PBKDF2',
        salt: pbkdf2salt,
        iterations: pbkdf2iterations,
        hash: 'SHA-256',
      },
      passphrasekey,
      384,
    )
    .catch(function (err) {
      console.error(err);
    });
  console.log('pbkdf2bytes derived');
  pbkdf2bytes = new Uint8Array(pbkdf2bytes);

  const keybytes = pbkdf2bytes.slice(0, 32);
  const ivbytes = pbkdf2bytes.slice(32);

  const key = await window.crypto.subtle
    .importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, [
      'encrypt',
    ])
    .catch(function (err) {
      console.error(err);
    });
  console.log('key imported');

  let cipherbytes = await window.crypto.subtle
    .encrypt({name: 'AES-CBC', iv: ivbytes}, key, plaintextbytes)
    .catch(function (err) {
      console.error(err);
    });

  if (!cipherbytes) {
    console.error('Fuck');
    return;
  }

  console.log('plaintext encrypted');
  cipherbytes = new Uint8Array(cipherbytes);

  const resultbytes = new Uint8Array(cipherbytes.length + 16);
  resultbytes.set(new TextEncoder('utf-8').encode('Salted__'));
  resultbytes.set(pbkdf2salt, 8);
  resultbytes.set(cipherbytes, 16);

  let encryptedBlob = new Blob([resultbytes], {
    type: file.type,
  });

  encryptedBlob.name = file.name;

  const passwordHash = await sha256(password);
  const passCheckString = passwordHash.substr(0, 10);

  encryptedBlob.path = `${file.path}.encrypted-sailplane_${passCheckString}`;
  encryptedBlob.lastModified = file.lastModified;
  encryptedBlob.lastModifiedDate = file.lastModifiedDate;
  return encryptedBlob;
};

export const decryptFile = async (file, password) => {
  let cipherbytes = await readfile(file).catch(function (err) {
    console.error(err);
  });

  cipherbytes = new Uint8Array(cipherbytes);

  const passphrasebytes = new TextEncoder('utf-8').encode(password);
  const pbkdf2salt = cipherbytes.slice(8, 16);

  const passphrasekey = await window.crypto.subtle
    .importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
    .catch(function (err) {
      console.error(err);
    });
  console.log('passphrasekey imported');

  let pbkdf2bytes = await window.crypto.subtle
    .deriveBits(
      {
        name: 'PBKDF2',
        salt: pbkdf2salt,
        iterations: pbkdf2iterations,
        hash: 'SHA-256',
      },
      passphrasekey,
      384,
    )
    .catch(function (err) {
      console.error(err);
    });
  console.log('pbkdf2bytes derived');
  pbkdf2bytes = new Uint8Array(pbkdf2bytes);

  const keybytes = pbkdf2bytes.slice(0, 32);
  const ivbytes = pbkdf2bytes.slice(32);
  cipherbytes = cipherbytes.slice(16);

  const key = await window.crypto.subtle
    .importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, [
      'decrypt',
    ])
    .catch(function (err) {
      console.error(err);
    });
  console.log('key imported');

  let plaintextbytes = await window.crypto.subtle
    .decrypt({name: 'AES-CBC', iv: ivbytes}, key, cipherbytes)
    .catch(function (err) {
      console.error(err);
    });

  if (!plaintextbytes) {
    return false;
  }

  console.log('ciphertext decrypted');
  plaintextbytes = new Uint8Array(plaintextbytes);

  const decryptedBlob = new Blob([plaintextbytes], {
    type: 'application/download',
  });
  decryptedBlob.name = file.name;
  decryptedBlob.path = file.path;
  decryptedBlob.lastModified = file.lastModified;
  decryptedBlob.lastModifiedDate = file.lastModifiedDate;

  return decryptedBlob;
};

export const getEncryptionInfoFromFilename = (filename) => {
  const extension = getFileExtensionFromFilename(filename);

  if (/encrypted-sailplane/.test(extension)) {
    const extensionSplit = extension.split('_');

    return {
      isEncrypted: true,
      passHash: extensionSplit[1],
      decryptedFilename: filename.substring(
        0,
        filename.length - extension.length - 1,
      ),
    };
  } else {
    return {};
  }
};
