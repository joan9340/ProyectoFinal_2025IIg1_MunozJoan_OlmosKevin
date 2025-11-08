import React from "react";
import { useAuth } from "../../Context/AuthContext";
import "./Dashboard.css";
import { Outlet } from "react-router-dom";

import Header from "../../Components/Header/Header";

export default function Dashboard() {
  const { userData } = useAuth();

  return (
    <div className="dashboard-page">
      <Header userData={userData} />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
