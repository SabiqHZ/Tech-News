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

import ProtectedRoute from "../components/layout/ProtectedRoute";

function AppRoutes() {
  const routes = useRoutes([
    // user
    { path: "/", element: <HomePage /> },
    { path: "/categories", element: <CategoriesPage /> },
    { path: "/categories/:categoryId", element: <CategoryArticlesPage /> },
    { path: "/article/:articleId", element: <ArticleDetailPage /> },
    { path: "/bookmarks", element: <BookmarksPage /> },
    { path: "/profile", element: <ProfilePage /> },

    // login admin (tidak di-protect)
    { path: "/admin/login", element: <AdminLoginPage /> },

    // admin protected
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute>
          <AdminDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/articles",
      element: (
        <ProtectedRoute>
          <AdminArticlesPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/articles/new",
      element: (
        <ProtectedRoute>
          <AdminArticleFormPage mode="create" />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/articles/:articleId/edit",
      element: (
        <ProtectedRoute>
          <AdminArticleFormPage mode="edit" />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/categories",
      element: (
        <ProtectedRoute>
          <AdminCategoriesPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/categories/new",
      element: (
        <ProtectedRoute>
          <AdminCategoryFormPage mode="create" />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/categories/:categoryId/edit",
      element: (
        <ProtectedRoute>
          <AdminCategoryFormPage mode="edit" />
        </ProtectedRoute>
      ),
    },
  ]);

  return routes;
}

export default AppRoutes;
