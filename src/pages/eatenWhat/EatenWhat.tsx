import React, { useRef, useState } from "react";
import AppBar from "../../components/AppBar";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import HistoryTable from "./HistoryTable";
import ActionButtons from "./ActionButtons";
import { HistoryType } from "../../slices/historiesSlice";

const EatenWhat: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [selectedHistories, setSelectedHistories] = useState<HistoryType[]>([]);

  return (
    <div className="flex flex-col h-full w-full">
      <Toast ref={toast} />
      <ConfirmDialog />
      <AppBar />

      <ActionButtons
        selectedHistoryTime={selectedHistories.map(
          (history) => history.dateString
        )}
        clearSelection={() => setSelectedHistories([])}
      />
      <HistoryTable
        selectedHistory={selectedHistories}
        setSelectedHistory={setSelectedHistories}
      />
    </div>
  );
};

export default EatenWhat;
