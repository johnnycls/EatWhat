import React, { useState } from "react";
import AppBar from "../../components/AppBar";
import { useAppSelector } from "../../app/store";

const EatenWhat: React.FC = () => {
  const restaurants = useAppSelector((state) => state.restaurants.restaurants);

  return (
    <div className="flex flex-col h-full w-full">
      <AppBar />

      <div className="w-full flex flex-col gap-1 flex-grow justify-center items-center">
      </div>
    </div>
  );
};

export default EatenWhat;
