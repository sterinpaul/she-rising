import { lazy, Suspense, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorBoundary, NotFound, ProtectedRoute } from "./components";
import Loader from "./components/Loader.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import { authUtils } from "./utils/auth";

const Home = lazy(() => import("./pages/Home.tsx"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail.tsx"));
const ImpactDetail = lazy(() => import("./pages/ImpactDetail.tsx"));
const AdminLogin = lazy(() => import("./components/AdminLogin.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const ArticlesList = lazy(() => import("./components/dashboard/ArticlesList.tsx"));
const ArticleEditor = lazy(() => import("./components/dashboard/ArticleEditor.tsx"));
const ImpactsList = lazy(() => import("./components/dashboard/ImpactsList.tsx"));
const ImpactEditor = lazy(() => import("./components/dashboard/ImpactEditor.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader/>}>
        <Home />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/article/:id",
    element: (
      <Suspense fallback={<Loader/>}>
        <ArticleDetail />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/impact/:id",
    element: (
      <Suspense fallback={<Loader/>}>
        <ImpactDetail />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Suspense fallback={<Loader/>}>
          <AdminLogin />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireAuth={true}>
        <Suspense fallback={<Loader/>}>
          <DashboardLayout title="Dashboard" subtitle="Welcome" />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader/>}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "articles",
        element: (
          <Suspense fallback={<Loader/>}>
            <ArticlesList />
          </Suspense>
        ),
      },
      {
        path: "articles/new",
        element: (
          <Suspense fallback={<Loader/>}>
            <ArticleEditor />
          </Suspense>
        ),
      },
      {
        path: "articles/:id/edit",
        element: (
          <Suspense fallback={<Loader/>}>
            <ArticleEditor />
          </Suspense>
        ),
      },
      {
        path: "impacts",
        element: (
          <Suspense fallback={<Loader/>}>
            <ImpactsList />
          </Suspense>
        ),
      },
      {
        path: "impacts/new",
        element: (
          <Suspense fallback={<Loader/>}>
            <ImpactEditor />
          </Suspense>
        ),
      },
      {
        path: "impacts/:id/edit",
        element: (
          <Suspense fallback={<Loader/>}>
            <ImpactEditor />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  useEffect(() => {
    // Initialize authentication state when app starts
    authUtils.initializeAuth().catch(console.error);
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
