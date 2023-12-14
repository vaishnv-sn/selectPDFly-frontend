import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import pdfFileIdSliceReducer from './pdfFile';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['pdfFileId'],
    blacklist: []
}

const persistedReducer = persistReducer(persistConfig, pdfFileIdSliceReducer);

export const store = configureStore({
    reducer: { pdfFileId: persistedReducer }
});

export const persistor = persistStore(store);