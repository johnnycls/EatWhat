import React, { useRef, useState } from "react";
import AppBar from "../../components/AppBar";
import { Restaurant } from "../../slices/restaurantsSlice";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import RestaurantTable from "./RestaurantTable";
import AddRestaurantDialog from "./AddRestaurantDialog";
import ImportDialog from "./ImportDialog";
import ActionButtons from "./ActionButtons";

const EatWhat: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>(
    []
  );
  const [isImportDialogVisible, setIsImportDialogVisible] =
    useState<boolean>(false);
  const [isAddRestaurantDialogVisible, setIsAddRestaurantVisible] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col h-full w-full">
      <Toast ref={toast} />
      <ConfirmDialog />
      <AppBar />

      <ActionButtons
        selectedRestaurants={selectedRestaurants}
        setSelectedRestaurants={setSelectedRestaurants}
        setIsAddRestaurantDialogVisible={setIsAddRestaurantVisible}
      />
      <RestaurantTable
        selectedRestaurants={selectedRestaurants}
        setSelectedRestaurants={setSelectedRestaurants}
      />

      <ImportDialog
        isImportDialogVisible={isImportDialogVisible}
        setIsImportDialogVisible={setIsImportDialogVisible}
        setSelectedRestaurants={setSelectedRestaurants}
      />

      <AddRestaurantDialog
        isAddRestaurantDialogVisible={isAddRestaurantDialogVisible}
        setIsAddRestaurantDialogVisible={setIsAddRestaurantVisible}
      />
    </div>
  );
};

export default EatWhat;
