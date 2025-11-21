import React from "react";
import AppRoutes from "./router";
import BottomNav from "./components/layout/BottomNav";

function App() {
  return (
    <div className="app-container">
      <div className="app-content">
        {/* Di sini semua halaman akan dirender */}
        <AppRoutes />
      </div>

      {/* Bottom navigation selalu di bawah */}
      <BottomNav />
    </div>
  );
}

export default App;
