import React, { useState } from "react";
import { db } from "../../FirebaseConfig/FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../Context/AuthContext";
import Button from "@mui/material/Button";
import "./CreateNews.css";

export default function CreateNews() {
  const { userData } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Manejo de imagen: validación de tamaño y dimensiones
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar tamaño máximo (2 MB)
    const maxSize = 2 * 1024 * 1024; // 2 MB en bytes
    if (file.size > maxSize) {
      alert("La imagen no debe superar los 2 MB.");
      e.target.value = null; // Limpia el input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Verificar dimensiones (máximo 500 × 500 px)
        if (img.width > 500 || img.height > 500) {
          alert("La imagen no puede superar los 500 × 500 px.");
          e.target.value = null;
          return;
        }

        // Si pasa las validaciones
        setImagen(event.target.result);
        setPreview(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Guardar noticia en Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.uid) {
      setMensaje("Error: No se detectó el usuario. Intenta iniciar sesión nuevamente.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      await addDoc(collection(db, "noticias"), {
        titulo,
        subtitulo,
        categoria,
        contenido,
        imagen,
        autor: userData?.nombre || "Anónimo",
        autorId: userData.uid,
        fechaCreacion: serverTimestamp(),
        estado: "pendiente",
      });

      setMensaje("Noticia guardada correctamente (pendiente de aprobación).");

      // Reiniciar formulario
      setTitulo("");
      setSubtitulo("");
      setCategoria("");
      setContenido("");
      setImagen(null);
      setPreview("");
    } catch (error) {
      console.error("Error al guardar la noticia:", error);
      setMensaje("Error al guardar la noticia. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-section">
      <h2>Crear Noticia</h2>
      <form onSubmit={handleSubmit} className="create-news-form">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subtítulo"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
        <textarea
          placeholder="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />

        <label className="file-label">Subir Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <small style={{ color: "#fa6e6eff" }}>
          Tamaño máximo: 2 MB | Dimensiones: 500 × 500 px
        </small>

        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            style={{
              width: "500px",
              height: "500px",
              objectFit: "cover",
              marginTop: "10px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        )}

        <Button variant="contained" color="primary" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Noticia"}
        </Button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}
