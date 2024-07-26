import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Restaurant = {
  name: string;
  weight: number;
  cats: string[];
};

type RestaurantsState = { restaurants: Restaurant[] };

const restaurantsInitialState: RestaurantsState = {
  restaurants: [],
};

const loadInitialState = (): RestaurantsState => {
  const savedState = localStorage.getItem("restaurants");
  if (savedState) {
    return JSON.parse(savedState);
  }
  return restaurantsInitialState;
};
const saveToLocalStorage = (state: RestaurantsState) => {
  localStorage.setItem("restaurants", JSON.stringify(state));
};
export const exportRestaurants = (state: RestaurantsState): void => {
  const exportData = JSON.stringify(state.restaurants);
  navigator.clipboard
    .writeText(exportData)
    .then(() => {
      console.log("Restaurants data copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy restaurants data: ", err);
    });
};

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: loadInitialState(),
  reducers: {
    addRestaurant: (
      state: RestaurantsState,
      { payload: { restaurant } }: PayloadAction<{ restaurant: Restaurant }>
    ) => {
      state.restaurants.push(restaurant);
      saveToLocalStorage(state);
    },
    changeRestaurant: (
      state: RestaurantsState,
      {
        payload: { restaurant, originalName },
      }: PayloadAction<{ restaurant: Restaurant; originalName: string }>
    ) => {
      const index = state.restaurants.findIndex((r) => r.name === originalName);
      if (index !== -1) {
        state.restaurants[index] = restaurant;
        saveToLocalStorage(state);
      }
    },
    removeRestaurant: (
      state: RestaurantsState,
      {
        payload: { restaurantNames },
      }: PayloadAction<{ restaurantNames: string[] }>
    ) => {
      state.restaurants = state.restaurants.filter(
        (restaurant) =>
          restaurantNames.find((name) => name === restaurant.name) === undefined
      );
      saveToLocalStorage(state);
    },
    replaceRestaurants: (
      state: RestaurantsState,
      { payload: { restaurants } }: PayloadAction<{ restaurants: Restaurant[] }>
    ) => {
      state.restaurants = restaurants;
      saveToLocalStorage(state);
    },
    mergeRestaurants: (
      state: RestaurantsState,
      { payload: { restaurants } }: PayloadAction<{ restaurants: Restaurant[] }>
    ) => {
      const mergedRestaurants = [...state.restaurants];
      restaurants.forEach((newRestaurant) => {
        const index = mergedRestaurants.findIndex(
          (r) => r.name === newRestaurant.name
        );
        if (index !== -1) {
          mergedRestaurants[index] = newRestaurant;
        } else {
          mergedRestaurants.push(newRestaurant);
        }
      });
      state.restaurants = mergedRestaurants;
      saveToLocalStorage(state);
    },
  },
});

export const {
  addRestaurant,
  changeRestaurant,
  removeRestaurant,
  replaceRestaurants,
  mergeRestaurants,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
