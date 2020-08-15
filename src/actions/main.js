import {main} from './actionTypes';

export function addInstance(name, address, isImported, isEncrypted, label) {
  return {
    type: main.ADD_INSTANCE,
    name,
    address,
    isImported,
    isEncrypted,
    label,
  };
}

export function addContact(pubKey, label) {
  return {
    type: main.ADD_CONTACT,
    label,
    pubKey,
  };
}

export function deleteContact(pubKey) {
  return {
    type: main.DELETE_CONTACT,
    pubKey,
  };
}

export function clearEncryptionKey() {
  return {
    type: main.CLEAR_ENCRYPTION_KEY,
  };
}

export function setInstanceIndex(index) {
  return {
    type: main.SET_INSTANCE_INDEX,
    index,
  };
}

export function setInstanceLabel(index, label) {
  return {
    type: main.SET_INSTANCE_LABEL,
    index,
    label,
  };
}

export function removeInstance(index) {
  return {
    type: main.REMOVE_INSTANCE,
    index,
  };
}

export function setNewUser(bool) {
  return {
    type: main.SET_NEW_USER,
    bool,
  };
}
