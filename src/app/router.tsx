import { Outlet, createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import ErrorPage from "../pages/error/Error";
import EatWhat from "../pages/eatWhat/EatWhat";
import EatenWhat from "../pages/eatenWhat/EatenWhat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Home /> },
      { path: "/eatwhat", element: <EatWhat /> },
      { path: "/eatenwhat", element: <EatenWhat /> }
    ],
  },
]);

export default router;
