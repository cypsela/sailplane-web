import {Buffer} from 'safe-buffer';
import secp256k1 from 'secp256k1';

const perms = {
  admin: 'admin',
  write: 'write',
  read: 'read'
};

export function localUserId(sharedFS) {
  return sharedFS.identity.id;
}

export function localUserPub(sharedFS) {
  return sharedFS.identity.publicKey;
}

export function userIdValid(userId) {
  try {
    return Buffer.from(userId, 'hex').length === 33;
  } catch (e) {
    return false;
  }
}

export function userPubValid(userPub) {
  try {
    return secp256k1.publicKeyVerify(Buffer.from(userPub, 'hex'));
  } catch (e) {
    return false;
  }
}

export function readers(sharedFS) {
  return sharedFS.access.get(perms.read);
}

export function writers(sharedFS) {
  return sharedFS.access.get(perms.write);
}

export function admin(sharedFS) {
  return sharedFS.access.get(perms.admin);
}

export async function grantRead(sharedFS, userPub) {
  return sharedFS.grantRead(userPub);
}

export async function grantWrite(sharedFS, userId) {
  return sharedFS.access.grant(perms.write, userId);
}

export function hasRead(sharedFS, userPub = localUserPub(sharedFS)) {
  return readers(sharedFS).has(userPub);
}

export function hasWrite(sharedFS, userId = localUserId(sharedFS)) {
  return new Set([...writers(sharedFS), ...admin(sharedFS)]).has(userId);
}

export function hasAdmin(sharedFS, userId = localUserId(sharedFS)) {
  return admin(sharedFS).has(userId);
}
