import {main as mainTypes} from '../actions/actionTypes';
import produce from 'immer';

const initialState = {
  instances: [],
  instanceIndex: 0,
  encryptionKey: null,
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case mainTypes.ADD_INSTANCE: {
      const {name, address} = action;
      return produce(state, (draftState) => {
        draftState.instances.push({name, address});
      });
    }

    case mainTypes.SET_INSTANCE_INDEX: {
      const {index} = action;
      return produce(state, (draftState) => {
        draftState.instanceIndex = index;
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
  }

  return state;
}
