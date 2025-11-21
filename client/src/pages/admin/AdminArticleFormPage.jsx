import React from "react";

const AdminArticleFormPage = ({ mode }) => {
  const title = mode === "edit" ? "Edit Berita" : "Tambah Berita";

  return (
    <div>
      <h1>{title}</h1>
      <p>Form {mode === "edit" ? "update" : "create"} berita.</p>
    </div>
  );
};

export default AdminArticleFormPage;
