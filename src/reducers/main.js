import {main as mainTypes} from '../actions/actionTypes';
import produce from 'immer';

const initialState = {
  instances: [],
  instanceIndex: 0,
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
    case mainTypes.REMOVE_INSTANCE: {
      const {index} = action;
      return produce(state, (draftState) => {
        draftState.instances = state.instances.filter(
          (instance, i) => index !== i,
        );

        console.log('state', draftState.instances[draftState.instanceIndex])
        if (!draftState.instances[draftState.instanceIndex]) {
          console.log('inner ran')
          draftState.instanceIndex = 0;
        }

        console.log('afterState', draftState.instances[draftState.instanceIndex])

      });
    }
  }

  return state;
}
