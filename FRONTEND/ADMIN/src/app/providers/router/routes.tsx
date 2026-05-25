import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ApplicationManager } from "@/pages/ApplicationManager";
import { GuestRoute } from "./GuestRoute";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminLayout } from "@/app/providers/layout/with-layout";
import { ServerError } from "@/pages/ServerError";
import { QuestionPage } from "@/pages/QuestionPage";
import { ROUTERS } from "@/shares/routers";


export const router = createBrowserRouter([
  {
    path: ROUTERS.HOME,
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <ApplicationManager />,
          },
          {
            path: ROUTERS.QUESTION,
            element: <QuestionPage />,
          },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: ROUTERS.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: ROUTERS.SERVER,
    element: <ServerError />,
  },
  {
    path: ROUTERS.OTHER,
    element: <NotFoundPage />,
  },
], {
  basename: import.meta.env.PROD ? '/admin/' : '/',
});
