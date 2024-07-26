import React, { useRef, useState } from "react";
import { useAppDispatch } from "../../app/store";
import {
  Restaurant,
  mergeRestaurants,
  replaceRestaurants,
} from "../../slices/restaurantsSlice";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

const ImportDialog: React.FC<{
  setSelectedRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  isImportDialogVisible: boolean;
  setIsImportDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setSelectedRestaurants,
  isImportDialogVisible,
  setIsImportDialogVisible,
}) => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);

  const [importRestaurantString, setImportRestaurantString] =
    useState<string>("");

  return (
    <>
      <Toast ref={toast} />
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
              label="合併"
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
              disabled={importRestaurantString.trim().length === 0}
              label="覆蓋"
              onClick={() => {
                try {
                  dispatch(
                    replaceRestaurants({
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
    </>
  );
};

export default ImportDialog;
