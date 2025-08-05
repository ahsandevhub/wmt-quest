import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "../auth/AuthProvider";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { questListLoader } from "../loaders/QuestList.loader";
import { questRequestLoader } from "../loaders/QuestRequest.loader";
import { updateQuestLoader } from "../loaders/updateQuest.loader";
import AddNewQuest from "../pages/AddNewQuest";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import QuestList from "../pages/QuestList";
import QuestRequest from "../pages/QuestRequest";
import UpdateQuest from "../pages/UpdateQuest";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      {
        path: "/quest/quest-list",
        element: <QuestList />,
        loader: questListLoader,
        handle: { showQuickTabs: true },
      },
      {
        path: "/quest/quest-list/add-new-quest",
        element: <AddNewQuest />,
      },
      {
        path: "/quest/quest-list/:id",
        element: <UpdateQuest />,
        loader: updateQuestLoader,
      },
      {
        path: "/quest/quest-requests",
        element: <QuestRequest />,
        loader: questRequestLoader,
        handle: { showQuickTabs: true },
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
