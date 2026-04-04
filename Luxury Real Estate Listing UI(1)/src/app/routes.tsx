import { useEffect } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import LandingPage from "./pages/LandingPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import ListingsPage from "./pages/ListingsPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./admin/LoginPage";
import AdminPage from "./admin/AdminPage";
import { ProtectedRoute } from "./admin/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/listings",
        element: <ListingsPage />,
      },
      {
        path: "/property/:id",
        element: <PropertyDetailPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/admin/login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/admin",
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
]);
