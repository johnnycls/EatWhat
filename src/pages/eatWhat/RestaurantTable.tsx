import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Restaurant, changeRestaurant } from "../../slices/restaurantsSlice";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import CatEditor from "./CatEditor";

const RestaurantTable: React.FC<{
  selectedRestaurants: Restaurant[];
  setSelectedRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
}> = ({ selectedRestaurants, setSelectedRestaurants }) => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);
  const restaurants = useAppSelector((state) => state.restaurants.restaurants);
  const cats = restaurants.reduce(
    (cats: string[], restaurant) => [...new Set([...cats, ...restaurant.cats])],
    []
  );

  return (
    <>
      <Toast ref={toast} />

      {restaurants.length > 0 && (
        <DataTable
          className="w-full h-full"
          value={restaurants}
          editMode="row"
          dataKey="name"
          onRowEditComplete={(e: DataTableRowEditCompleteEvent) => {
            dispatch(
              changeRestaurant({
                restaurant: e.newData as Restaurant,
                originalName: e.data.name,
              })
            );
          }}
          selectionMode={"checkbox"}
          selection={selectedRestaurants}
          onSelectionChange={(e) => setSelectedRestaurants(e.value)}
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            field={"name"}
            header={"餐廳名"}
            editor={(options) => (
              <InputText
                type="text"
                value={options.value}
                onChange={(e) => {
                  if (options.editorCallback) {
                    options.editorCallback(e.target.value);
                  }
                }}
              />
            )}
          />
          <Column
            field={"weight"}
            header={"比重"}
            editor={(options) => (
              <InputNumber
                pt={{ input: { root: { className: "w-12" } } }}
                value={options.value}
                onChange={(e) => {
                  if (options.editorCallback) {
                    options.editorCallback(e.value);
                  }
                }}
              />
            )}
          />

          <Column
            field={"cats"}
            header={"標籤"}
            body={(restaurant: Restaurant) => restaurant.cats.join(", ")}
            editor={(options) => <CatEditor options={options} cats={cats} />}
          />
          <Column rowEditor={true} bodyStyle={{ textAlign: "center" }} />
        </DataTable>
      )}
    </>
  );
};

export default RestaurantTable;
