import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type HistoryType = {
  name: string;
  dateString: string;
};

export type HistorysState = { histories: HistoryType[] };

const historiesInitialState: HistorysState = {
  histories: [],
};

const loadInitialState = (): HistorysState => {
  const savedState = localStorage.getItem("histories");
  if (savedState) {
    return JSON.parse(savedState);
  }
  return historiesInitialState;
};
const saveToLocalStorage = (state: HistorysState) => {
  localStorage.setItem("histories", JSON.stringify(state));
};

export const historiesSlice = createSlice({
  name: "histories",
  initialState: loadInitialState(),
  reducers: {
    addHistory: (
      state: HistorysState,
      { payload: { history } }: PayloadAction<{ history: HistoryType }>
    ) => {
      state.histories.push(history);
      saveToLocalStorage(state);
    },
    clearHistory: (
      state: HistorysState,
      { payload: {} }: PayloadAction<{}>
    ) => {
      state.histories = [];
      saveToLocalStorage(state);
    },
    removeHistory: (
      state: HistorysState,
      { payload: { historyTimes } }: PayloadAction<{ historyTimes: string[] }>
    ) => {
      state.histories = state.histories.filter(
        (history) =>
          historyTimes.find((time) => time === history.dateString) === undefined
      );
      saveToLocalStorage(state);
    },
  },
});

export const { addHistory, clearHistory, removeHistory } =
  historiesSlice.actions;

export default historiesSlice.reducer;
