import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import "./NewsCard.css";
import Error_404 from "../../assets/Error_404.png"

const NewsCard = ({ news }) => {
  if (!news || typeof news !== "object" || !news.titulo) {
    return (
      <div style={{ padding: 20, color: "gray", textAlign: "center" }}>
        Cargando noticia...
      </div>
    );
  }

  //  Formatear fecha
  let fechaLegible = "Fecha desconocida";
  if (news.fechaCreacion) {
    if (news.fechaCreacion.seconds) {
      const date = new Date(news.fechaCreacion.seconds * 1000);
      fechaLegible = date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } else if (typeof news.fechaCreacion === "string") {
      fechaLegible = news.fechaCreacion;
    }
  }

  return (
    <Card
      className="news-card"
      sx={{
        width: "100%",
        maxWidth: 360,
        borderRadius: "15px",
        margin: "1.5rem auto",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardActionArea>
        <CardMedia
  component="img"
  height="160"
  image={news.imagen || Error_404}
  alt={news.titulo}
/>

        <CardContent sx={{ padding: "1rem" }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              color: "#222",
              fontWeight: 700,
              fontFamily: "Segoe UI, sans-serif",
              fontSize: "1.05rem",
            }}
          >
            {news.titulo}
          </Typography>

          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              color: "#555",
              mb: 0.5,
              fontFamily: "Segoe UI, sans-serif",
            }}
          >
            {news.subtitulo}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "justify",
              lineHeight: 1.5,
              color: "#444",
              fontFamily: "Segoe UI, sans-serif",
            }}
          >
            {news.contenido}
          </Typography>

          <Typography
            variant="caption"
            display="block"
            sx={{
              mt: 1,
              color: "#666",
              fontStyle: "italic",
              fontSize: "0.8rem",
            }}
          >
            {fechaLegible}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NewsCard;
