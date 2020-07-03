import {main as mainTypes} from '../actions/actionTypes';
import produce from 'immer';

const initialState = {

};

export default function main(state = initialState, action) {
  switch (action.type) {
    case mainTypes.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
  }

  return state;
}
