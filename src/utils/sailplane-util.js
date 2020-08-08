
import {randomBytes} from 'libp2p-crypto';
import Crypter from '@tabcat/aes-gcm-crypter';
import OrbitDBAddress from 'orbit-db/src/orbit-db-address';
const { parse } = OrbitDBAddress;
const bip39 = require('bip39');

export async function addressValid(sailplane, address) {
  if (OrbitDBAddress.isValid(address)) {
    const manifest = await addressManifest(sailplane, address);
    if (manifest.type !== 'fsstore') {
      return false;
    }
    const acl = await addressManifestACL(sailplane, address);
    if (acl.type !== 'orbitdb') {
      return false;
    }
    return true;
  } else { return false }
}

const defaultAddressOptions = ({ iv, enc, identity }) => ({
  meta: {
    iv,
    enc
  },
  accessController: {
    type: 'orbitdb',
    admin: [identity.publicKey],
  },
});

export async function determineAddress(sailplane, options = {}) {
  const iv = options.iv || randomBytes(16)
  const identity = options.identity || sailplane._orbitdb.identity
  const address = await sailplane.determineAddress(
    options.name || `sailplane/drives/${iv.toString('hex')}`,
    {...defaultAddressOptions({ iv, enc: options.enc, identity }), ...options},
  );
  if (options.enc) {
    // initializing encryption key and persisting it to the store
    const cryptoKey = options.cryptoKey || await Crypter.generateKey()
    const crypter = await Crypter.create(cryptoKey)
    const drive = await sailplane.mount(address, { crypter, Crypter })
    await drive.stop()
  }
  return address;
};

export function driveName(address) {
  const bytes = new TextEncoder().encode(parse(address).root);
  return bip39.entropyToMnemonic(bytes.slice(-32))
    .split(' ')
    .slice(-3)
    .join('-');
};

const ipfs = (sailplane) => sailplane._orbitdb._ipfs

export async function addressManifest(sailplane, address) {
  const { value } = await ipfs(sailplane).dag.get(parse(address).root);
  return value;
};

export async function addressManifestACL(sailplane, address) {
  const { accessController } = await addressManifest(sailplane, parse(address));
  const { value } = await ipfs(sailplane).dag.get(accessController);
  return value;
};

const defaultSfsOptions = {
  autoStart: false
};

export function mount(sailplane, address, sfsQueue = {}, options = {}) {
  address = address.toString()
  return sailplane.mounted[address] || sfsQueue[address] ||
    (() => sfsQueue[address] = sailplane
      .mount(address, {...defaultSfsOptions, ...options})
      .finally(() => delete sfsQueue[address])
    )();
};
