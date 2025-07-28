import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import QuestList from "../pages/QuestList";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/quests",
        element: <QuestList />,
        // loader: questListLoader,
      },
    ],
  },
]);

export default router;
