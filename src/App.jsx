import "./App.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./utils/firebase-config";
import { getAuth } from "firebase/auth";
import Home from "./components/Home/Home";
import Error from "./components/UI/Error";
import HomePage from "./components/LandingPage/HomePage";
import RootLayout from "./components/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import { loader as inboxLoader } from "./components/Dashboard/Dashboard";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,

    children: [
      { index: true, element: <HomePage /> },
      { path: "sign-up", element: <Home /> },
      { path: "dashboard", element: <Dashboard />, loader: inboxLoader },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
