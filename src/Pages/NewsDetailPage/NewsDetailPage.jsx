import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../FirebaseConfig/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./NewsDetailPage.css";
import HeaderPage from "../../Components/HeaderPage/HeaderPage";
import { CircularProgress, Container, Typography, Divider } from "@mui/material";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const docRef = doc(db, "noticias", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNews(docSnap.data());
        } else {
          console.error("Noticia no encontrada");
        }
      } catch (err) {
        console.error("Error al cargar la noticia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading)
    return (
      <div className="news-detail-loading">
        <CircularProgress />
      </div>
    );

  if (!news) return <p>Noticia no encontrada.</p>;

  return (
    <div className="news-detail-page">
      <HeaderPage />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {news.titulo}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {news.categoria} —{" "}
          {news.fechaCreacion?.toDate
            ? news.fechaCreacion.toDate().toLocaleDateString()
            : ""}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {news.imagen && (
          <img
            src={news.imagen}
            alt={news.titulo}
            className="news-detail-image"
          />
        )}

        <Typography variant="h6" sx={{ mt: 3 }}>
          {news.subtitulo}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8 }}>
          {news.contenido}
        </Typography>
      </Container>
    </div>
  );
};

export default NewsDetailPage;
