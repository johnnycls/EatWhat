import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { HistoryType, changeHistory } from "../../slices/historiesSlice";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

const HistoryTable: React.FC<{
  selectedHistory: HistoryType[];
  setSelectedHistory: React.Dispatch<React.SetStateAction<HistoryType[]>>;
}> = ({ selectedHistory, setSelectedHistory }) => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);
  const histories = useAppSelector((state) => state.histories.histories);
  const restaurants = useAppSelector((state) => state.restaurants.restaurants);

  return (
    <>
      <Toast ref={toast} />

      {histories.length > 0 && (
        <DataTable
          className="w-full h-full"
          value={histories}
          editMode="row"
          dataKey="dateString"
          selectionMode={"checkbox"}
          selection={selectedHistory}
          onSelectionChange={(e) => setSelectedHistory(e.value)}
          onRowEditComplete={(e: DataTableRowEditCompleteEvent) => {
            dispatch(
              changeHistory({
                history: e.newData as HistoryType,
                originalDateString: e.data.dateString,
              })
            );
          }}
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column
            field={"name"}
            header={"餐廳名"}
            editor={(options) => (
              <Dropdown
                value={options.value}
                onChange={(e: DropdownChangeEvent) => {
                  if (options.editorCallback) {
                    options.editorCallback(e.value);
                  }
                }}
                options={restaurants.map((res) => res.name)}
                optionLabel="name"
                className=""
              />
            )}
          />
          <Column
            header={"時間"}
            field="dateString"
            body={(history: HistoryType) =>
              `${new Date(history.dateString).toLocaleDateString()} ${new Date(
                history.dateString
              ).toLocaleTimeString()}`
            }
            editor={(options) => (
              <Calendar
                value={new Date(options.value)}
                onChange={(e) => {
                  if (options.editorCallback) {
                    options.editorCallback(e.value?.toISOString());
                  }
                }}
                showTime
                hourFormat="12"
              />
            )}
          />
          <Column rowEditor={true} bodyStyle={{ textAlign: "center" }} />
        </DataTable>
      )}
    </>
  );
};

export default HistoryTable;
