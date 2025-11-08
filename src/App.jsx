// src/App.jsx
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

          {/* Panel Reportero */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Panel Editor */}
          <Route
            path="/admin"
            element={
              <RoleRoute rolesAllowed={["editor"]}>
                <AdminPanel />
              </RoleRoute>
            }
          />

          {/* Redirección predeterminada */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;







// import React from "react";
// import "./App.css";
// import Header from "./Components/Header/Header.jsx";
// import News from "./Components/News/News.jsx";

// // Gestión de usuarios
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./Context/AuthContext";
// import Login from "./Components/Auth/Login";
// import Register from "./Components/Auth/Register";
// import ProtectedRoute from "./Components/Routes/ProtectedRoute";
// import RoleRoute from "./Components/Routes/RoleRoute";

// function Dashboard() {
//   return <h1>Panel del usuario autenticado</h1>;
// }

// function AdminPanel() {
//   return <h1>Panel solo para editores</h1>;
// }

// function App() {
//   return (
//     <AuthProvider>
//   <BrowserRouter>
//     <Header />
//     <Routes>
//       <Route path="/" element={<News />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin"
//         element={
//           <RoleRoute rolesAllowed={["editor"]}>
//             <AdminPanel />
//           </RoleRoute>
//         }
//       />
//     </Routes>
//   </BrowserRouter>
// </AuthProvider>

//   );
// }

// export default App;
