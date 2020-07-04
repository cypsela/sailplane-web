/* istanbul ignore file */

import {tempData} from './actionTypes';

export function setStatus(status) {
  return {
    type: tempData.SET_STATUS,
    status
  };
}
