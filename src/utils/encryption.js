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

  const pbkdf2iterations = 10000;
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
  encryptedBlob.path = file.path;
  encryptedBlob.lastModified = Date.now();
  encryptedBlob.lastModifiedDate = new Date();
  return encryptedBlob
};
