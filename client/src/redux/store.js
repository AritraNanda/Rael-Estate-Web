// import { configureStore , combineReducers} from '@reduxjs/toolkit'
// import userReducer from './user/userSlice'
// //import { persistReducer } from 'redux-persist'
// import { persistReducer, persistStore} from 'redux-persist';
// import storage from 'redux-persist/lib/storage'

// const rootReducer = combineReducers({user: userReducer});

// const persistConfig = {
//     key: 'root',
//     storage,
//     version: 1,
// }

// const persistedReducer=persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//     reducer: persistedReducer,

//     middleware: (getDefaultMiddleware)=>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         }),
// })

// export const persistor = persistStore(store);

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/userSlice'; // Buyer slice
import sellerReducer from './user/sellerSlice'; // Seller slice
import adminReducer from './user/adminSlice'; // Admin slice

// Persist config for buyer (user)
const buyerPersistConfig = {
  key: 'buyer', // Key for buyer data in localStorage
  storage,
  version: 1,
};

// Persist config for seller
const sellerPersistConfig = {
  key: 'seller', // Key for seller data in localStorage
  storage,
  version: 1,
};

// Persist config for admin
const adminPersistConfig = {
  key: 'admin', // Key for admin data in localStorage
  storage,
  version: 1,
};

// Combine reducers with persist
const rootReducer = combineReducers({
  user: persistReducer(buyerPersistConfig, userReducer), // Buyer slice
  seller: persistReducer(sellerPersistConfig, sellerReducer), // Seller slice
  admin: persistReducer(adminPersistConfig, adminReducer), // Admin slice
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux Persist
    }),
});

// Create persistor
export const persistor = persistStore(store);