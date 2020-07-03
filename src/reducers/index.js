import {combineReducers} from 'redux';
import main from '../reducers/main';
import tempData from '../reducers/tempData';

const rootReducer = combineReducers({
  main,
  tempData,
});

export default rootReducer;
