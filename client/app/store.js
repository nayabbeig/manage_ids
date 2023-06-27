import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { votersApi } from "../api/votersApi";
import { panchayatsApi } from "../api/panchayatsApi";
import { electionsApi } from "../api/electionsApi";
import galleryReducer from "../components/GallerySlice";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [votersApi.reducerPath]: votersApi.reducer,
    [panchayatsApi.reducerPath]: panchayatsApi.reducer,
    [electionsApi.reducerPath]: electionsApi.reducer,
    gallery: galleryReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(votersApi.middleware)
      .concat(panchayatsApi.middleware)
      .concat(electionsApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
