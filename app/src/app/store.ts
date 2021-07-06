import { ThunkAction, Action, createStore } from "@reduxjs/toolkit";

export const store = createStore((state = {}, action: { type: any }) => {
  switch (action.type) {
    case "HELLO_REACT":
      return { state, say: "Hello World Redux" };
    default:
      return state;
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
