
import {randomBytes} from 'libp2p-crypto';
const bip39 = require('bip39');

const defaultAddressOptions = () => ({
  meta: {
    iv: [...randomBytes(16)]
  },
  accessController: {
    type: 'orbitdb'
  },
});

export function determineAddress(sailplane, options = {}) {
  return sailplane.determineAddress(
    options.name || 'sailplane-web_drive',
    {...defaultAddressOptions(), ...options},
  );
};

export function driveName(address) {
  const bytes = new TextEncoder().encode(address.root);
  return bip39.entropyToMnemonic(bytes.slice(-32))
    .split(' ')
    .slice(-3)
    .join('-');
};

const ipfs = (sailplane) => sailplane._orbitdb._ipfs

export async function addressManifest(sailplane, address) {
  const { value } = await ipfs(sailplane).dag.get(address.root)
  return value
};

export async function addressManifestACL(sailplane, address) {
  const { accessController } = await addressManifest(sailplane, address)
  const { value } = await ipfs(sailplane).dag.get(accessController)
  return value
};

const defaultSfsOptions = {
  autoStart: false
};

export function mount(sailplane, address, sfsQueue = {}, options = {}) {
  return sailplane.mounted[address] || sfsQueue[address] ||
    (() => sfsQueue[address] = sailplane
      .mount(address, {...defaultSfsOptions, ...options})
      .finally(() => delete sfsQueue[address])
    )();
};
