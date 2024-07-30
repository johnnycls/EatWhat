import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { Restaurant, addRestaurant } from "../../slices/restaurantsSlice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";

const initialRestaurant = {
  name: "",
  weight: 1,
  cats: [],
};

const AddRestaurantDialog: React.FC<{
  isAddRestaurantDialogVisible: boolean;
  setIsAddRestaurantDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}> = ({ isAddRestaurantDialogVisible, setIsAddRestaurantDialogVisible }) => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);

  const [newRestaurant, setNewRestaurant] =
    useState<Restaurant>(initialRestaurant);

  const [catOptions, setCatOptions] = useState<string[]>([]);

  const restaurants = useAppSelector((state) => state.restaurants.restaurants);
  const cats = restaurants.reduce(
    (cats: string[], restaurant) => [...new Set([...cats, ...restaurant.cats])],
    []
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="加入餐廳"
        visible={isAddRestaurantDialogVisible}
        style={{ width: "90vw" }}
        onHide={() => {
          if (!isAddRestaurantDialogVisible) return;
          setIsAddRestaurantDialogVisible(false);
        }}
        footer={
          <div className="">
            <Button
              label={"加入"}
              disabled={newRestaurant.name.trim().length === 0}
              onClick={() => {
                dispatch(addRestaurant({ restaurant: newRestaurant }));
                setNewRestaurant(initialRestaurant);
                setIsAddRestaurantDialogVisible(false);
              }}
            />
            <Button
              label="取消"
              onClick={() => {
                setNewRestaurant(initialRestaurant);
                setIsAddRestaurantDialogVisible(false);
              }}
            />
          </div>
        }
      >
        <div className="flex flex-wrap gap-1 items-center p-4">
          <div className="flex flex-col">
            <label>餐廳名</label>
            <InputText
              value={newRestaurant.name}
              onChange={(e) => {
                setNewRestaurant((res) => ({
                  ...res,
                  name: e.target.value.trim(),
                }));
              }}
            />
          </div>

          <div className="flex flex-col">
            <label>比重(幾想食)</label>
            <InputNumber
              pt={{ input: { root: { className: "w-16" } } }}
              value={newRestaurant.weight}
              onChange={(e) => {
                e.value &&
                  setNewRestaurant((res) => ({
                    ...res,
                    weight: e.value as number,
                  }));
              }}
            />
          </div>

          <div className="flex flex-col">
            <label>標籤(輸入後請按選項以加入標籤)</label>
            <AutoComplete
              multiple
              value={newRestaurant.cats}
              suggestions={catOptions}
              completeMethod={(event: AutoCompleteCompleteEvent) => {
                setCatOptions(
                  [
                    ...cats.filter((cat) => cat.includes(event.query)),
                    event.query,
                  ].filter((cat) => cat)
                );
              }}
              onChange={(e: AutoCompleteChangeEvent) =>
                e.value &&
                setNewRestaurant((res) => ({
                  ...res,
                  cats: e.value,
                }))
              }
              dropdown
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddRestaurantDialog;
