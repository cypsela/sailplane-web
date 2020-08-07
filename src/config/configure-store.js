import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';

import rootReducer from '../reducers/index';
import {createLogger} from 'redux-logger';

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['tempData'],
  stateReconciler: autoMergeLevel1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let middleware = [];

// if (__DEV__) {
//   const logger = createLogger();
//   middleware.push(logger);
// }

export default function configureStore(initialState) {
  const store = compose(applyMiddleware(...middleware))(createStore)(
    persistedReducer,
  );

  const persistor = persistStore(store);
  return {store, persistor};
}
