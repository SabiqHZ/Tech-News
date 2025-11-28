import { useRoutes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import CategoriesPage from "../pages/CategoriesPage";
import CategoryArticlesPage from "../pages/CategoryArticlesPage";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import BookmarksPage from "../pages/BookmarksPage";
import ProfilePage from "../pages/ProfilePage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";

function AppRoutes() {
  const routes = useRoutes([
    // user
    { path: "/", element: <HomePage /> },
    { path: "/categories", element: <CategoriesPage /> },
    { path: "/categories/:categoryId", element: <CategoryArticlesPage /> },
    { path: "/article/:articleId", element: <ArticleDetailPage /> },
    { path: "/bookmarks", element: <BookmarksPage /> },
    { path: "/profile", element: <ProfilePage /> },

    // login admin
    { path: "/admin/login", element: <AdminLoginPage /> },
  ]);

  return routes;
}

export default AppRoutes;
