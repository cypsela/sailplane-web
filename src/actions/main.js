import {main} from './actionTypes';

export function addInstance(name, address) {
  return {
    type: main.ADD_INSTANCE,
    name,
    address
  };
}

export function setInstanceIndex(index) {
  return {
    type: main.SET_INSTANCE_INDEX,
    index,
  };
}
export function removeInstance(index) {
  return {
    type: main.REMOVE_INSTANCE,
    index,
  };
}
