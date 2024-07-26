import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
  Restaurant,
  exportRestaurants,
  removeRestaurant,
} from "../../slices/restaurantsSlice";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import ImportDialog from "./ImportDialog";
import { ButtonGroup } from "primereact/buttongroup";

const ActionButtons: React.FC<{
  selectedRestaurants: Restaurant[];
  setSelectedRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  setIsAddRestaurantDialogVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}> = ({
  selectedRestaurants,
  setSelectedRestaurants,
  setIsAddRestaurantDialogVisible,
}) => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);
  const restaurants = useAppSelector((state) => state.restaurants.restaurants);

  const [isImportDialogVisible, setIsImportDialogVisible] =
    useState<boolean>(false);

  return (
    <>
      <div className="w-full flex justify-between p-1">
        <div></div>
        <ButtonGroup>
          <Button
            label="加入餐廳"
            onClick={() => {
              setIsAddRestaurantDialogVisible(true);
            }}
          />
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
        </ButtonGroup>
      </div>

      <Toast ref={toast} />

      <ImportDialog
        setIsImportDialogVisible={setIsImportDialogVisible}
        isImportDialogVisible={isImportDialogVisible}
        setSelectedRestaurants={setSelectedRestaurants}
      />
    </>
  );
};

export default ActionButtons;
