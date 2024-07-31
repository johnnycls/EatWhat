import React, { useState } from "react";
import DrawLotsGame from "./DrawLotsGame";
import AppBar from "../../components/AppBar";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { ToggleButton, ToggleButtonChangeEvent } from "primereact/togglebutton";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { addHistory } from "../../slices/historiesSlice";

const numDaysBetween = (d1: Date, d2: Date) => {
  var diff = Math.abs(d1.getTime() - d2.getTime());
  return diff / (1000 * 60 * 60 * 24);
};

function hasIntersection(arr1: string[], arr2: string[]): boolean {
  const set1 = new Set(arr1);
  return arr2.some((item) => set1.has(item));
}

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  const restaurants = useAppSelector((state) => state.restaurants.restaurants);
  const histories = useAppSelector((state) => state.histories.histories);

  const [filterHistory, setFilterHistory] = useState<boolean>(true);
  const [filterDays, setFilterDays] = useState<number>(5);

  const cats = restaurants.reduce(
    (cats: string[], restaurant) => [...new Set([...cats, ...restaurant.cats])],
    []
  );
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [catOptions, setCatOptions] = useState<string[]>([]);

  const filteredRestaurants = (() => {
    const filteredCatsRestaurants =
      cats.length === 0 || selectedCats.length === 0
        ? restaurants
        : restaurants.filter((restaurant) =>
            hasIntersection(restaurant.cats, selectedCats)
          );
    return filterHistory
      ? filteredCatsRestaurants.filter((restaurant) => {
          const history = histories.find(
            (history) => history.name === restaurant.name
          );
          if (history === undefined) {
            return true;
          } else {
            return (
              numDaysBetween(new Date(history.dateString), new Date()) >
              filterDays
            );
          }
        })
      : filteredCatsRestaurants;
  })();

  return (
    <div className="flex flex-col h-full w-full">
      <AppBar />

      <div className="w-full flex flex-col gap-1 flex-grow justify-center items-center">
        {restaurants.length !== 0 && (
          <>
            <div className="flex items-center gap-1">
              <ToggleButton
                checked={filterHistory}
                onChange={(e: ToggleButtonChangeEvent) =>
                  setFilterHistory(e.value)
                }
                onLabel="我唔想食"
                offLabel="我唔介意食"
              />
              {filterHistory ? (
                <>
                  <InputNumber
                    pt={{ input: { root: { className: "w-16" } } }}
                    value={filterDays}
                    onValueChange={(e: InputNumberValueChangeEvent) =>
                      e.value && setFilterDays(e.value)
                    }
                  />
                  <label>日內食過嘅野</label>
                </>
              ) : (
                <label>最近食過嘅野</label>
              )}
            </div>

            {cats.length > 0 && (
              <div className="flex items-center gap-1">
                <label>我要食</label>
                <AutoComplete
                  className="w-48"
                  multiple
                  value={selectedCats}
                  suggestions={catOptions}
                  completeMethod={(event: AutoCompleteCompleteEvent) => {
                    setCatOptions(
                      cats.filter((cat) => cat.includes(event.query))
                    );
                  }}
                  onChange={(e: AutoCompleteChangeEvent) =>
                    e.value && setSelectedCats(e.value)
                  }
                  dropdown
                />
                <label>嘅餐廳</label>
              </div>
            )}
          </>
        )}

        {restaurants.length === 0 ? (
          <div>未有餐廳,請新增餐廳</div>
        ) : filteredRestaurants.length === 0 ? (
          <div>冇餐廳符合你嘅要求,請新增餐廳或改變設定</div>
        ) : (
          <DrawLotsGame
            lots={filteredRestaurants}
            onWin={(winningRestaurant) => {
              dispatch(
                addHistory({
                  history: {
                    name: winningRestaurant.name,
                    dateString: new Date().toISOString(),
                  },
                })
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
