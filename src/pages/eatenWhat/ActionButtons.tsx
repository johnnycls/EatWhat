import React from "react";
import { useAppDispatch } from "../../app/store";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { ButtonGroup } from "primereact/buttongroup";
import { clearHistory, removeHistory } from "../../slices/historiesSlice";

const ActionButtons: React.FC<{
  selectedHistoryTime: string[];
  clearSelection: () => void;
}> = ({ selectedHistoryTime, clearSelection }) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="w-full flex justify-between p-1">
        <div></div>
        <ButtonGroup>
          <Button
            label="清空紀錄"
            onClick={() => {
              confirmDialog({
                message: "肯定要清空紀錄?",
                header: "肯定?",
                icon: "pi pi-exclamation-triangle",
                defaultFocus: "accept",
                accept: () => {
                  dispatch(clearHistory({}));
                  clearSelection();
                },
                reject: () => {
                  clearSelection();
                },
              });
            }}
          />
          <Button
            disabled={selectedHistoryTime.length === 0}
            label="刪除紀錄"
            onClick={() => {
              confirmDialog({
                message: "肯定要刪?",
                header: "肯定?",
                icon: "pi pi-exclamation-triangle",
                defaultFocus: "accept",
                accept: () => {
                  dispatch(
                    removeHistory({ historyTimes: selectedHistoryTime })
                  );
                  clearSelection();
                },
                reject: () => {
                  clearSelection();
                },
              });
            }}
          />
        </ButtonGroup>
      </div>
    </>
  );
};

export default ActionButtons;
