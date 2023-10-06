import "./App.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./utils/firebase-config";
import { getAuth } from "firebase/auth";
import Home from "./components/Home";
import Error from "./components/Error";
import RootLayout from "./components/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import { loader as inboxLoader } from "./components/Dashboard/Dashboard";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log(auth.currentUser);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
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
