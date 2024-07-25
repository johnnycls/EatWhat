import React, { useRef, useState } from "react";
import AppBar from "../../components/AppBar";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import {
  Restaurant,
  addRestaurant,
  changeRestaurant,
  exportRestaurants,
  mergeRestaurants,
  removeRestaurant,
} from "../../slices/restaurantsSlice";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

const initialRestaurant = {
  name: "",
  weight: 1,
  isActive: true,
};

const EatWhat: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);
  const restaurants = useAppSelector((state) => state.restaurants.restaurants);

  const [newRestaurant, setNewRestaurant] =
    useState<Restaurant>(initialRestaurant);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>(
    []
  );

  const [importRestaurantString, setImportRestaurantString] =
    useState<string>("");
  const [isImportDialogVisible, setIsImportDialogVisible] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col h-full w-full">
      <AppBar />

      <div className="w-full flex justify-end">
        <div className="p-1">
          <Button
            label="匯入"
            onClick={() => {
              setIsImportDialogVisible(true);
            }}
          />
          <Button
            disabled={restaurants.length === 0}
            label="匯出"
            onClick={() => {
              exportRestaurants({ restaurants });
              toast.current?.show({
                severity: "success",
                summary: "成功",
                detail: "已複製到剪貼版",
              });
            }}
          />
          <Button
            disabled={selectedRestaurants.length === 0}
            label="刪除"
            onClick={() => {
              confirmDialog({
                message: "肯定要刪?",
                header: "肯定?",
                icon: "pi pi-exclamation-triangle",
                defaultFocus: "accept",
                accept: () => {
                  dispatch(
                    removeRestaurant({
                      restaurantNames: selectedRestaurants.map(
                        (res) => res.name
                      ),
                    })
                  );
                  setSelectedRestaurants([]);
                },
                reject: () => {
                  setSelectedRestaurants([]);
                },
              });
            }}
          />
        </div>
      </div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Dialog
        header="匯入"
        visible={isImportDialogVisible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!isImportDialogVisible) return;
          setIsImportDialogVisible(false);
        }}
        footer={
          <div className="">
            <Button
              disabled={importRestaurantString.trim().length === 0}
              label="確定"
              onClick={() => {
                try {
                  dispatch(
                    mergeRestaurants({
                      restaurants: JSON.parse(importRestaurantString.trim()),
                    })
                  );
                } catch (error) {
                  toast.current?.show({
                    severity: "error",
                    summary: "錯誤",
                    detail: "匯入格式不正確",
                  });
                } finally {
                  setImportRestaurantString("");
                  setIsImportDialogVisible(false);
                  setSelectedRestaurants([]);
                }
              }}
            />
            <Button
              label="取消"
              onClick={() => {
                setImportRestaurantString("");
                setIsImportDialogVisible(false);
                setSelectedRestaurants([]);
              }}
            />
          </div>
        }
      >
        <InputTextarea
          autoResize
          className="w-full"
          value={importRestaurantString}
          onChange={(e) => {
            setImportRestaurantString(e.target.value);
          }}
        />
      </Dialog>

      <DataTable
        className="w-full h-full"
        value={restaurants}
        editMode="row"
        dataKey="name"
        onRowEditComplete={(e: DataTableRowEditCompleteEvent) => {
          dispatch(changeRestaurant({ restaurant: e.newData as Restaurant }));
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
                if (options.editorCallback)
                  options.editorCallback(e.target.value);
              }}
            />
          )}
        />
        <Column
          field={"weight"}
          header={"比重(幾想食)"}
          editor={(options) => (
            <InputNumber
              pt={{ input: { root: { className: "w-16" } } }}
              value={options.value}
              onChange={(e) => {
                if (options.editorCallback) options.editorCallback(e.value);
              }}
            />
          )}
        />
        <Column
          field={"isActive"}
          header={"生效"}
          editor={(options) => (
            <InputSwitch
              checked={options.value}
              onChange={(e) => {
                if (options.editorCallback) options.editorCallback(e.value);
              }}
            />
          )}
        />
        <Column rowEditor={true} bodyStyle={{ textAlign: "center" }} />
      </DataTable>

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
          <label>生效</label>{" "}
          <InputSwitch
            checked={newRestaurant.isActive}
            onChange={(e) =>
              e.value &&
              setNewRestaurant((res) => ({
                ...res,
                isActive: e.value,
              }))
            }
          />
        </div>

        <Button
          label={"加"}
          disabled={newRestaurant.name.trim().length === 0}
          onClick={() => {
            dispatch(addRestaurant({ restaurant: newRestaurant }));
            setNewRestaurant(initialRestaurant);
          }}
        />
      </div>
    </div>
  );
};

export default EatWhat;
