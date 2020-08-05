import {main as mainTypes} from '../actions/actionTypes';
import produce from 'immer';

const initialState = {
  instances: [],
  instanceIndex: 0,
  encryptionKey: null,
  newUser: true,
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case mainTypes.ADD_INSTANCE: {
      const {name, address, isImported, isEncrypted} = action;
      return produce(state, (draftState) => {
        draftState.instances.push({name, address, isImported, isEncrypted});
      });
    }

    case mainTypes.SET_INSTANCE_INDEX: {
      const {index} = action;
      return produce(state, (draftState) => {
        draftState.instanceIndex = Math.max(0, index);
      });
    }

    case mainTypes.SET_ENCRYPTION_KEY: {
      const {key, keyType} = action;
      return produce(state, (draftState) => {
        draftState.encryptionKey = {
          key,
          type: keyType,
        };
      });
    }

    case mainTypes.CLEAR_ENCRYPTION_KEY: {
      const {key, keyType} = action;
      return produce(state, (draftState) => {
        draftState.encryptionKey = null;
      });
    }

    case mainTypes.REMOVE_INSTANCE: {
      const {index} = action;
      return produce(state, (draftState) => {
        draftState.instances = state.instances.filter(
          (instance, i) => index !== i,
        );

        if (!draftState.instances[draftState.instanceIndex]) {
          console.log('inner ran');
          draftState.instanceIndex = 0;
        }
      });
    }

    case mainTypes.SET_NEW_USER: {
      const {bool} = action
      return produce(state, (draftState) => {
        draftState.newUser = bool
      })
    }
  }

  return state;
}
