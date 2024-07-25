import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type History = {
  name: string;
  datetime: Date;
};

export type HistorysState = { histories: History[] };

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
export const exportHistorys = (state: HistorysState): void => {
  const exportData = JSON.stringify(state.histories);
  navigator.clipboard
    .writeText(exportData)
    .then(() => {
      console.log("Historys data copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy histories data: ", err);
    });
};

export const historiesSlice = createSlice({
  name: "histories",
  initialState: loadInitialState(),
  reducers: {
    addHistory: (
      state: HistorysState,
      { payload: { history } }: PayloadAction<{ history: History }>
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
    changeHistory: (
      state: HistorysState,
      { payload: { history } }: PayloadAction<{ history: History }>
    ) => {
      const index = state.histories.findIndex((r) => r.name === history.name);
      if (index !== -1) {
        state.histories[index] = history;
        saveToLocalStorage(state);
      }
    },
    removeHistory: (
      state: HistorysState,
      { payload: { historyTimes } }: PayloadAction<{ historyTimes: string[] }>
    ) => {
      state.histories = state.histories.filter(
        (history) =>
          historyTimes.find(
            (time) => time === history.datetime.toISOString()
          ) === undefined
      );
      saveToLocalStorage(state);
    },
    replaceHistorys: (
      state: HistorysState,
      { payload: { histories } }: PayloadAction<{ histories: History[] }>
    ) => {
      state.histories = histories;
      saveToLocalStorage(state);
    },
    mergeHistorys: (
      state: HistorysState,
      { payload: { histories } }: PayloadAction<{ histories: History[] }>
    ) => {
      const mergedHistorys = [...state.histories];
      histories.forEach((newHistory) => {
        const index = mergedHistorys.findIndex(
          (r) => r.name === newHistory.name
        );
        if (index !== -1) {
          mergedHistorys[index] = newHistory;
        } else {
          mergedHistorys.push(newHistory);
        }
      });
      state.histories = mergedHistorys;
      saveToLocalStorage(state);
    },
  },
});

export const {
  addHistory,
  clearHistory,
  changeHistory,
  removeHistory,
  replaceHistorys,
  mergeHistorys,
} = historiesSlice.actions;

export default historiesSlice.reducer;
