import React from "react";

const AdminCategoryFormPage = ({ mode }) => {
  const title = mode === "edit" ? "Edit Kategori" : "Tambah Kategori";

  return (
    <div>
      <h1>{title}</h1>
      <p>Form {mode === "edit" ? "update" : "create"} kategori.</p>
    </div>
  );
};

export default AdminCategoryFormPage;
