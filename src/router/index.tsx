import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../containers/auth/LoginContainer";
import AuthProvider from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

import NotFound from "../containers/NotFound";
import QuestList from "../containers/quests/QuestListContainer";
import QuestRequestDetail from "../containers/quests/QuestRequestDetailContainer";
import QuestRequestList from "../containers/quests/QuestRequestListContainer";

import AddNewQuest from "../containers/quests/AddNewQuestContainer";
import QuestDetail from "../containers/quests/QuestDetailContainer";
import { questDetailLoader } from "../loaders/QuestDetail.loader";
import { questListLoader } from "../loaders/QuestList.loader";
import { questRequestDetailLoader } from "../loaders/QuestRequestDetails.loader";
import { questRequestListLoader } from "../loaders/QuestRequestList.loader";

// Keep providers INSIDE the Router context
function AppProviders() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <AppProviders />,
    children: [
      { path: "/", element: <LoginPage /> },

      {
        path: "/quest",
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <Navigate to="quest-list" replace /> },

              {
                path: "quest-list",
                element: <QuestList />,
                loader: questListLoader,
                handle: { showQuickTabs: true },
              },
              { path: "quest-list/add-new-quest", element: <AddNewQuest /> },
              {
                path: "quest-list/:id",
                element: <QuestDetail />,
                loader: questDetailLoader,
              },

              {
                path: "quest-requests",
                element: <QuestRequestList />,
                loader: questRequestListLoader,
                handle: { showQuickTabs: true },
              },
              {
                path: "quest-requests/:questRequestId",
                element: <QuestRequestDetail />,
                loader: questRequestDetailLoader,
              },

              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
