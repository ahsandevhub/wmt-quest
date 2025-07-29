import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import MainLayout from "../layouts/MainLayout";
import AddNewQuest from "../pages/AddNewQuest";
import LoginPage from "../pages/LoginPage";
import QuestList from "../pages/QuestList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "/quests",
        element: <QuestList />,
        // loader: questListLoader,
      },
      {
        path: "/quests/add-new-quest",
        element: <AddNewQuest />,
      },
    ],
  },
]);

export default router;
