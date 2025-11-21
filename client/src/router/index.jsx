import React from "react";
import { useRoutes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import CategoriesPage from "../pages/CategoriesPage";
import CategoryArticlesPage from "../pages/CategoryArticlesPage";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import BookmarksPage from "../pages/BookmarksPage";
import ProfilePage from "../pages/ProfilePage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminArticlesPage from "../pages/admin/AdminArticlesPage";
import AdminArticleFormPage from "../pages/admin/AdminArticleFormPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminCategoryFormPage from "../pages/admin/AdminCategoryFormPage";

function AppRoutes() {
  const routes = useRoutes([
    // USER ROUTES
    { path: "/", element: <HomePage /> },
    { path: "/categories", element: <CategoriesPage /> },
    { path: "/categories/:categoryId", element: <CategoryArticlesPage /> },
    { path: "/article/:articleId", element: <ArticleDetailPage /> },
    { path: "/bookmarks", element: <BookmarksPage /> },
    { path: "/profile", element: <ProfilePage /> },

    // ADMIN ROUTES
    { path: "/admin/login", element: <AdminLoginPage /> },
    { path: "/admin/dashboard", element: <AdminDashboardPage /> },
    { path: "/admin/articles", element: <AdminArticlesPage /> },
    {
      path: "/admin/articles/new",
      element: <AdminArticleFormPage mode="create" />,
    },
    {
      path: "/admin/articles/:articleId/edit",
      element: <AdminArticleFormPage mode="edit" />,
    },

    { path: "/admin/categories", element: <AdminCategoriesPage /> },
    {
      path: "/admin/categories/new",
      element: <AdminCategoryFormPage mode="create" />,
    },
    {
      path: "/admin/categories/:categoryId/edit",
      element: <AdminCategoryFormPage mode="edit" />,
    },
  ]);

  return routes;
}

export default AppRoutes;
