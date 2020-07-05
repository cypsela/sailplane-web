import {tempData} from '../actions/actionTypes';

const initialState = {
  status: {},
  shareData: {},
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case tempData.SET_STATUS: {
      return {
        ...state,
        status: action.status,
      };
    }
    case tempData.SET_SHARE_DATA: {
      return {
        ...state,
        shareData: action.shareData,
      };
    }
  }

  return state;
}
