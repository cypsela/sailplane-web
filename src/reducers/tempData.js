import {tempData} from '../actions/actionTypes';

const initialState = {
  status: {},
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case tempData.SET_STATUS:
      return {
        ...state,
        status: action.status,
      };
  }

  return state;
}
