
'use strict'
import {getMnemonic} from './Utils';

const defaultAddressOptions = {
  meta: 'superdrive',
  accessController: {
    type: 'orbitdb'
  },
};

export function defaultAddress(sailplane) {
  return sailplane.determineAddress(
    getMnemonic(),
    defaultAddressOptions,
  );
}

const defaultSfsOptions = {
  autoStart: false
};

export function mountSFS(sailplane, address, sfsQueue = {}, options = {}) {
  return sailplane.mounted[address] || sfsQueue[address] ||
    (() => sfsQueue[address] = sailplane
      .mount(address, { ...defaultSfsOptions, ...options})
      .finally(() => delete sfsQueue[address])
    )();
};
