// src/app.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page.jsx";
import MainPage from "./routes/main";
import NewBook from "./routes/new";
import EditBook from "./routes/edit";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <MainPage />,
            },
            {
                path: "/new",
                element: <NewBook />,
            },
            {
                path: "/edit/:id",
                element: <EditBook />,
            }
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}