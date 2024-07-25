import React, { useState } from "react";
import DrawLotsGame from "./DrawLotsGame";
import AppBar from "../../components/AppBar";
import { useAppSelector } from "../../app/store";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { ToggleButton, ToggleButtonChangeEvent } from "primereact/togglebutton";

var numDaysBetween = function (d1: Date, d2: Date) {
  var diff = Math.abs(d1.getTime() - d2.getTime());
  return diff / (1000 * 60 * 60 * 24);
};

const Home: React.FC = () => {
  const restaurants = useAppSelector((state) => state.restaurants.restaurants);
  const histories = useAppSelector((state) => state.histories.histories);

  const [filterHistory, setFilterHistory] = useState<boolean>(false);
  const [filterDays, setFilterDays] = useState<number>(5);

  const filteredRestaurants = (() => {
    const activeRestaurants = restaurants.filter(
      (restaurant) => restaurant.isActive
    );
    return filterHistory
      ? activeRestaurants.filter((restaurant) => {
          const history = histories.find(
            (history) => history.name === restaurant.name
          );
          if (history === undefined) {
            return true;
          } else {
            return numDaysBetween(history.datetime, new Date()) > filterDays;
          }
        })
      : activeRestaurants;
  })();

  return (
    <div className="flex flex-col h-full w-full">
      <AppBar />

      <div className="w-full flex flex-col gap-1 flex-grow justify-center items-center">
        <div className="flex items-center gap-1">
          <ToggleButton
            checked={filterHistory}
            onChange={(e: ToggleButtonChangeEvent) => setFilterHistory(e.value)}
            onLabel="唔想食"
            offLabel="唔介意食"
          />
          <InputNumber
            pt={{ input: { root:{ className: "w-16" } } }}
            value={filterDays}
            onValueChange={(e: InputNumberValueChangeEvent) =>
              e.value && setFilterDays(e.value)
            }
          />
          <label className="">日內食過嘅野</label>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div>請新增餐廳或改變歷史設定</div>
        ) : (
          <DrawLotsGame lots={filteredRestaurants} />
        )}
      </div>
    </div>
  );
};

export default Home;
