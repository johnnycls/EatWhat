import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage =
      error.status + " " + (error.data.message || error.statusText);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h2 className="text-3xl">Ooops</h2>
      <p>An unexpected error has occurred.</p>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorPage;
