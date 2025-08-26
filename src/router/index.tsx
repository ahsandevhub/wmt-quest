import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ConditionalNotFound from "../components/auth/ConditionalNotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import LoginPage from "../containers/auth/LoginContainer";
import AuthProvider from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

import BlindboxPage from "../containers/blindbox/BlindboxContainer";
import PlaceholderPage from "../containers/common/PlaceholderPage";
import DiscountPage from "../containers/discount/DiscountContainer";
import NotFound from "../containers/NotFound";
import AddNewQuest from "../containers/quests/AddNewQuestContainer";
import QuestDetail from "../containers/quests/QuestDetailContainer";
import QuestList from "../containers/quests/QuestListContainer";
import QuestRequestDetail from "../containers/quests/QuestRequestDetailContainer";
import QuestRequestList from "../containers/quests/QuestRequestListContainer";

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
      // Public routes (login page) - redirect to quest-list if authenticated
      {
        path: "/",
        element: <PublicRoute />,
        children: [{ index: true, element: <LoginPage /> }],
      },

      // Protected routes - require authentication
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

              // Quest sub-routes
              {
                path: "welcome",
                element: <PlaceholderPage title="Welcome Quests" />,
              },
              {
                path: "redeem",
                element: <PlaceholderPage title="Quest Redeem" />,
              },
              {
                path: "configuration",
                element: <PlaceholderPage title="Quest Configuration" />,
              },
              {
                path: "tournament",
                element: <PlaceholderPage title="Tournament Quests" />,
              },

              // 404 within protected area
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },

      // Discount routes
      {
        path: "/discount",
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <DiscountPage /> },
              { path: "ap", element: <PlaceholderPage title="AP Discount" /> },
              {
                path: "configuration",
                element: <PlaceholderPage title="Discount Configuration" />,
              },
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },

      // Blindbox routes
      {
        path: "/blindbox",
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { index: true, element: <BlindboxPage /> },
              {
                path: "secret",
                element: <PlaceholderPage title="Secret Configuration" />,
              },
              {
                path: "probability",
                element: <PlaceholderPage title="Probability" />,
              },
              {
                path: "spin",
                element: <PlaceholderPage title="Spin Configuration" />,
              },
              { path: "rewards", element: <PlaceholderPage title="Rewards" /> },
              { path: "*", element: <NotFound /> },
            ],
          },
        ],
      },

      // Global catch-all - redirect to login if unauthenticated, show 404 if authenticated
      { path: "*", element: <ConditionalNotFound /> },
    ],
  },
]);

export default router;
