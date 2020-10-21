import {main as mainTypes} from '../actions/actionTypes';
import produce from 'immer';

const initialState = {
  instances: [],
  contacts: [],
  instanceIndex: 0,
  newUser: true,
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case mainTypes.ADD_INSTANCE: {
      const {name, address, isImported, isEncrypted, label} = action;
      return produce(state, (draftState) => {
        draftState.instances.push({
          name,
          address,
          isImported,
          isEncrypted,
          label,
        });
      });
    }

    case mainTypes.SET_INSTANCE_INDEX: {
      const {index} = action;
      return produce(state, (draftState) => {
        draftState.instanceIndex = Math.max(0, index);
      });
    }

    case mainTypes.ADD_CONTACT: {
      const {label, pubKey} = action;
      return produce(state, (draftState) => {
        if (!draftState.contacts) {
          draftState.contacts = [];
        }

        draftState.contacts.push({label, pubKey});
      });
    }

    case mainTypes.DELETE_CONTACT: {
      const {pubKey} = action;
      return produce(state, (draftState) => {
        draftState.contacts = state.contacts.filter(
          (contact) => contact.pubKey !== pubKey,
        );
      });
    }

    case mainTypes.SET_INSTANCE_LABEL: {
      const {index, label} = action;
      return produce(state, (draftState) => {
        draftState.instances[index].label = label;
      });
    }

    case mainTypes.REMOVE_INSTANCE: {
      const {index} = action;
      return produce(state, (draftState) => {
        draftState.instances = state.instances.filter(
          (instance, i) => index !== i,
        );

        if (!draftState.instances[draftState.instanceIndex]) {
          draftState.instanceIndex = 0;
        }
      });
    }

    case mainTypes.SET_NEW_USER: {
      const {bool} = action;
      return produce(state, (draftState) => {
        draftState.newUser = bool;
      });
    }
  }

  return state;
}
