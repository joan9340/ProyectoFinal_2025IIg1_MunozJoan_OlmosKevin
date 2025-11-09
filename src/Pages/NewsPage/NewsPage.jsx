import React, { useEffect, useState } from "react";
import "./NewsPage.css";
import { db } from "../../FirebaseConfig/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

import HeaderPage from "../../Components/HeaderPage/HeaderPage";
import NewsPageCard from "../../Components/NewsPageCard/NewsPageCard";

import {
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Pagination,
  Stack,
} from "@mui/material";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("todas");

  // 🔽 Estado del menú flotante
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // 📄 Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "noticias"), where("estado", "==", "publicado"));
        const querySnapshot = await getDocs(q);

        const docs = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => {
            const fechaA = a.fechaCreacion?.toDate
              ? a.fechaCreacion.toDate()
              : new Date(0);
            const fechaB = b.fechaCreacion?.toDate
              ? b.fechaCreacion.toDate()
              : new Date(0);
            return fechaB - fechaA;
          });

        setNews(docs);

        const uniqueCategories = [
          ...new Set(docs.map((item) => item.categoria).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error al cargar noticias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews =
    selectedCategory === "todas"
      ? news
      : news.filter((n) => n.categoria === selectedCategory);

  // 📄 Calcular las noticias visibles en esta página
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  // 📄 Manejadores de eventos
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1); // Reiniciar a página 1 al cambiar categoría
    handleClose();
  };
  const handlePageChange = (event, value) => setCurrentPage(value);

  return (
    <div className="news-page">
      <HeaderPage />
      <main className="news-page-content">
        <h2 className="news-title">Noticias</h2>

        {/* 🧭 Menú flotante MUI */}
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            maxWidth: 400,
            margin: "0 auto",
            borderRadius: 2,
          }}
        >
          <List component="nav" aria-label="filtro de categorías">
            <ListItemButton onClick={handleClick}>
              <ListItemText
                primary={`Categoría: ${
                  selectedCategory === "todas" ? "Todas" : selectedCategory
                }`}
              />
            </ListItemButton>
          </List>
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={() => handleSelectCategory("todas")}>
            Todas
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} onClick={() => handleSelectCategory(cat)}>
              {cat}
            </MenuItem>
          ))}
        </Menu>

        {/* 📰 Noticias */}
        <section className="news-page-cards">
          {loading ? (
            <p>Cargando noticias...</p>
          ) : currentNews.length >= 0 ? (
            currentNews.map((item) => (
              <NewsPageCard key={item.id} news={item} />
            ))
          ) : (
            <p>No hay noticias disponibles.</p>
          )}
        </section>

        {/* 📄 Paginación */}
        {!loading && totalPages >= 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        )}
      </main>
    </div>
  );
};

export default NewsPage;
