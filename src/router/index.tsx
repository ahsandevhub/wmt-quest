import { createBrowserRouter } from "react-router-dom";
import AuthProvider from "../auth/AuthProvider";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { questDetailLoader } from "../loaders/QuestDetail.loader";
import { questListLoader } from "../loaders/QuestList.loader";
import { questRequestLoader } from "../loaders/QuestRequest.loader";
import { questRequestDetailLoader } from "../loaders/QuestRequestDetails.loader";
import AddNewQuest from "../pages/AddNewQuest";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import QuestDetail from "../pages/QuestDetail";
import QuestList from "../pages/QuestList";
import QuestRequest from "../pages/QuestRequest";
import QuestRequestDetail from "../pages/QuestRequestDetails";

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
        element: <QuestDetail />,
        loader: questDetailLoader,
      },
      {
        path: "/quest/quest-requests",
        element: <QuestRequest />,
        loader: questRequestLoader,
        handle: { showQuickTabs: true },
      },
      {
        path: "/quest/quest-requests/:questRequestId",
        element: <QuestRequestDetail />,
        loader: questRequestDetailLoader,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
