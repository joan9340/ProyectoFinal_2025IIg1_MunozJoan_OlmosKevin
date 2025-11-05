import React, { useState, useEffect } from 'react';
import './News.css';
import NewsCard from '../NewsCard/NewsCard.jsx';
import app, { db } from "../../FirebaseConfig/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const News = () => {
  const [news, setNews] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, "noticias", "noti1");
        const docSnap = await getDoc(docRef);

        console.log(" docSnap.exists():", docSnap.exists());
        console.log(" docSnap.data():", docSnap.data());
        console.log(" docSnap.id:", docSnap.id);

        if (docSnap.exists()) {
          setNews({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn(" No se encontró el documento");
        }
      } catch (error) {
        console.error(" Error al obtener la noticia:", error);
      }
    };

    getData();
  }, []);

  console.log(" Estado news:", news);

  return (
    <main>
      {news ? <NewsCard news={news} /> : <p>Cargando noticia...</p>}
    </main>
  );
};

export default News;
