import {tempData} from '../actions/actionTypes';

const initialState = {
  connectionState: null
};

export default function main(state = initialState, action) {
  let copy = {...state};

  switch (action.type) {
    case tempData.SET_CONNECTION_STATE:
      return {
        ...state,
        connectionState: action.connectionState,
      };
  }

  return state;
}
