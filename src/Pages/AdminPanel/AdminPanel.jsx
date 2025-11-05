// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../Context/AuthContext";
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import { db } from "../../FirebaseConfig/FirebaseConfig.js";
// import { useNavigate } from "react-router-dom";
// import "./AdminPanel.css";

// export default function AdminPanel() {
//   const { userData, logout } = useAuth();
//   const navigate = useNavigate();
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Verificar rol
//   useEffect(() => {
//     if (!userData || userData.role !== "editor") {
//       navigate("/dashboard");
//     }
//   }, [userData]);

//   // Cargar noticias
//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "noticias"));
//         const docs = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setNews(docs);
//       } catch (err) {
//         console.error(err);
//         setError("No se pudieron cargar las noticias.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNews();
//   }, []);

//   // Actualizar estado (aprobar o desactivar)
//   const updateStatus = async (id, status) => {
//     try {
//       const docRef = doc(db, "noticias", id);
//       await updateDoc(docRef, { estado: status });
//       setNews((prev) =>
//         prev.map((n) => (n.id === id ? { ...n, estado: status } : n))
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Error al actualizar el estado de la noticia.");
//     }
//   };

//   if (loading) return <p className="loading">Cargando noticias...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className="admin-panel">
//       <header className="admin-header">
//         <h1>Panel del Editor</h1>
//         <button className="logout-btn" onClick={logout}>
//           Cerrar sesión
//         </button>
//       </header>

//       <h3>Gestión de noticias</h3>
//       <div className="news-grid">
//         {news.length === 0 ? (
//           <p>No hay noticias registradas.</p>
//         ) : (
//           news.map((n) => (
//             <div key={n.id} className="news-card">
//               <img src={n.imagen} alt={n.titulo} className="news-img" />
//               <div className="news-info">
//                 <h4>{n.titulo}</h4>
//                 <p>{n.descripcion}</p>
//                 <p className="estado">
//                   Estado:{" "}
//                   <span
//                     className={
//                       n.estado === "publicado"
//                         ? "estado-publicado"
//                         : n.estado === "inactivo"
//                         ? "estado-inactivo"
//                         : "estado-pendiente"
//                     }
//                   >
//                     {n.estado || "pendiente"}
//                   </span>
//                 </p>

//                 <div className="btn-group">
//                   <button
//                     className="btn-approve"
//                     onClick={() => updateStatus(n.id, "publicado")}
//                   >
//                     ✅ Aprobar
//                   </button>
//                   <button
//                     className="btn-disable"
//                     onClick={() => updateStatus(n.id, "inactivo")}
//                   >
//                     🚫 Desactivar
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig/FirebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [news, setNews] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    categoria: "",
    contenido: "",
  });

  useEffect(() => {
    const fetchNews = async () => {
      const querySnapshot = await getDocs(collection(db, "noticias"));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNews(docs);
    };
    fetchNews();
  }, []);

  const actualizarEstado = async (id, nuevoEstado) => {
    const docRef = doc(db, "noticias", id);
    await updateDoc(docRef, { estado: nuevoEstado });
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, estado: nuevoEstado } : n))
    );
  };

  const handleEdit = (noticia) => {
    setEditando(noticia.id);
    setFormData({
      titulo: noticia.titulo,
      subtitulo: noticia.subtitulo,
      categoria: noticia.categoria,
      contenido: noticia.contenido,
    });
  };

  const handleSave = async (id) => {
    const docRef = doc(db, "noticias", id);
    await updateDoc(docRef, formData);
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...formData } : n))
    );
    setEditando(null);
    alert("✅ Noticia actualizada correctamente.");
  };

  const handleCancel = () => setEditando(null);

  return (
    <div className="admin-panel">
      <h2>Panel del Editor</h2>
      <h3>Gestión de noticias</h3>

      <div className="news-grid">
        {news.map((n) => (
          <div key={n.id} className="news-card">
            {editando === n.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={formData.subtitulo}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitulo: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                />
                <textarea
                  value={formData.contenido}
                  onChange={(e) =>
                    setFormData({ ...formData, contenido: e.target.value })
                  }
                />

                <div className="btn-group">
                  <button className="btn-save" onClick={() => handleSave(n.id)}>
                    💾 Guardar
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>
                    ❌ Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img src={n.imagen} alt={n.titulo} className="news-img" />
                <h4>{n.titulo}</h4>
                <p><strong>{n.categoria}</strong></p>
                <p>{n.subtitulo}</p>
                <p>{n.contenido}</p>
                <p className="estado">
                  Estado:{" "}
                  <span
                    className={
                      n.estado === "publicado"
                        ? "estado-publicado"
                        : n.estado === "pendiente"
                        ? "estado-pendiente"
                        : "estado-inactivo"
                    }
                  >
                    {n.estado}
                  </span>
                </p>

                {/* ✅ Botones del editor */}
                <div className="btn-group">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(n)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-approve"
                    onClick={() => actualizarEstado(n.id, "publicado")}
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    className="btn-deactivate"
                    onClick={() => actualizarEstado(n.id, "inactivo")}
                  >
                    🔴 Desactivar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

