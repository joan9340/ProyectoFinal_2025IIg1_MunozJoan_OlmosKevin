import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import RoleRoute from "./Components/Routes/RoleRoute";
import SelectRole from "./Pages/SelectRole/SelectRole";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import "./App.css";

import CreateNews from "./Components/CreateNews/CreateNews";
import NewsList from "./Components/NewsList/NewsList";
import NewsPage from "./Pages/NewsPage/NewsPage";
import NewsDetailPage from "./Pages/NewsDetailPage/NewsDetailPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Selección de rol */}
          <Route path="/select-role" element={<SelectRole />} />

          {/* Página de noticias pública */}
          <Route path="/" element={<NewsPage />}>
          </Route>
          <Route path=":id" element={<NewsDetailPage />} /> 

          {/* Dashboard */}
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="create" element={<CreateNews />} />
            <Route path="my-news" element={<NewsList />} />
            <Route path="admin" element={<RoleRoute rolesAllowed={["editor"]}><AdminPanel /></RoleRoute>} />
          </Route>

          {/* Redirección predeterminada */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;