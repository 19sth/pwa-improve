import { Action, Dispatch, configureStore } from "@reduxjs/toolkit";
import pageReducer from "./slicePage";
import targetReducer from "./sliceTarget";

export const KEY_LOCALSTORAGE = "app-state-improve";

function removeNonSerializable(obj: any) {
  let newObj = null;
  if (Array.isArray(obj)) {
    newObj = [...obj];
    for (let i = 0; i < obj.length; i++) {
      newObj[i] = removeNonSerializable(obj[i]);
    }
  } else if (typeof obj === "object") {
    newObj = { ...obj };
    for (const key in obj) {
      newObj[key] = removeNonSerializable(obj[key]);
    }
  } else {
    try {
      JSON.stringify(obj);
      return obj;
    } catch (error) {
      return null;
    }
  }
  return newObj;
}

const localStorageMiddleware = ({ getState }: { getState: () => any }) => {
  return (next: Dispatch) => (action: Action) => {
    const result = next(action);
    let state = { ...getState() };
    state = removeNonSerializable(state);
    localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(state));
    return result;
  };
};

const reHydrateStore = () => {
  let strJson = "{}";
  strJson = localStorage.getItem(KEY_LOCALSTORAGE) || "{}";
  return JSON.parse(strJson);
};

export const store = configureStore({
  reducer: {
    page: pageReducer,
    target: targetReducer,
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({serializableCheck: false}).concat(localStorageMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
