import React, { useState, useEffect } from "react";
import { Button, TextField, List, ListItem, ListItemText, IconButton, Stack } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "./CategoryManager.css";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("categories");
    if (saved) setCategories(JSON.parse(saved));
  }, []);

  // Guardar automáticamente al cambiar
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Crear categoría
  const handleAdd = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) return alert("La categoría ya existe");
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };

  // Eliminar categoría
  const handleDelete = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // Activar modo edición
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(categories[index]);
  };

  // Guardar cambios
  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    const updated = [...categories];
    updated[editIndex] = editValue.trim();
    setCategories(updated);
    setEditIndex(null);
    setEditValue("");
  };

  return (
    <div className="category-manager">
      <h2>Gestión de Categorías</h2>

      {/* Crear nueva */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Agregar
        </Button>
      </Stack>

      {/* Listado */}
      <List className="category-list">
        {categories.map((cat, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                {editIndex === index ? (
                  <Button onClick={handleSaveEdit} color="success">
                    Guardar
                  </Button>
                ) : (
                  <>
                    <IconButton onClick={() => handleEdit(index)} color="info">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)} color="error">
                      <Delete />
                    </IconButton>
                  </>
                )}
              </>
            }
          >
            {editIndex === index ? (
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                size="small"
                fullWidth
              />
            ) : (
              <ListItemText primary={cat} />
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CategoryManager;
