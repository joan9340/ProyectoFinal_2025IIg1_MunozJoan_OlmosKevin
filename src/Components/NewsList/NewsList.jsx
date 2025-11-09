import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import "./NewsList.css";

export default function NewsList() {
  const { userData } = useAuth();
  const [news, setNews] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    categoria: "",
    contenido: "",
  });
  const [loading, setLoading] = useState(true);

  // Verificar rol del usuario
  useEffect(() => {
    console.log("Rol detectado:", userData?.role);
  }, [userData]);

  // Cargar noticias
  useEffect(() => {
    const fetchNews = async () => {
      if (!userData?.uid) return;
      try {
        let q;
        if (userData?.role === "editor") {
          q = query(collection(db, "noticias"));
        } else {
          q = query(
            collection(db, "noticias"),
            where("autorId", "==", userData.uid)
          );
        }

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNews(docs);
      } catch (err) {
        console.error("Error al cargar noticias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [userData]);

  // Iniciar edición según el rol
  const handleEdit = (noticia) => {
    if (userData?.role === "reportero" && noticia.estado === "publicado") {
      alert("No puedes editar una noticia publicada. Solo el editor puede hacerlo.");
      return;
    }

    setEditando(noticia.id);
    setFormData({
      titulo: noticia.titulo,
      subtitulo: noticia.subtitulo,
      categoria: noticia.categoria,
      contenido: noticia.contenido,
    });
  };

  // Guardar cambios
  const handleSave = async (id) => {
    try {
      const docRef = doc(db, "noticias", id);
      await updateDoc(docRef, formData);
      setNews((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...formData } : n))
      );
      setEditando(null);
      alert("Noticia actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la noticia:", error);
      alert("Error al guardar los cambios.");
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditando(null);
  };

  if (loading) return <p className="loading">Cargando noticias...</p>;

  return (
    <div className="news-list-container">
      <h2>{userData?.role === "editor" ? "Todas las Noticias" : "Mis Noticias"}</h2>

      {news.length === 0 ? (
        <p>No hay noticias registradas.</p>
      ) : (
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
                      Guardar
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img src={n.imagen} alt={n.titulo} className="news-img" />
                  <h4>{n.titulo}</h4>
                  <p>
                    <strong>{n.categoria}</strong>
                  </p>
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
                      {n.estado || "pendiente"}
                    </span>
                  </p>

                  {/* Mostrar botón según rol */}
                  {(userData?.role === "editor" ||
                    (userData?.role === "reportero" &&
                      n.estado !== "publicado")) && (
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(n)}
                      >
                        Editar
                      </button>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}