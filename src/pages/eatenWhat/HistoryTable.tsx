import React, { useRef } from "react";
import { useAppSelector } from "../../app/store";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { HistoryType } from "../../slices/historiesSlice";

const HistoryTable: React.FC<{
  selectedHistory: HistoryType[];
  setSelectedHistory: React.Dispatch<React.SetStateAction<HistoryType[]>>;
}> = ({ selectedHistory, setSelectedHistory }) => {
  const toast = useRef<Toast>(null);
  const histories = useAppSelector((state) => state.histories.histories);

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
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column field={"name"} header={"餐廳名"} />
          <Column
            header={"時間"}
            body={(history: HistoryType) =>
              `${new Date(history.dateString).toLocaleDateString()} ${new Date(
                history.dateString
              ).toLocaleTimeString()}`
            }
          />
        </DataTable>
      )}
    </>
  );
};

export default HistoryTable;
