import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Fade } from "@mui/material";
import { useNavigate } from "react-router-dom"; 


const NewsPageCard = ({ news }) => {
    const fecha =
        news.fechaCreacion?.toDate?.()?.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }) || "Sin fecha";

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`${news.id}`);
    };
    
    return (
        <Fade in={true} timeout={1000}>
            <Card sx={{ maxWidth: 300, margin: 1, borderRadius: 1, boxShadow: 3 }}>
                <CardActionArea onClick={handleClick}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={news.imagen || "/static/images/cards/default.jpg"}
                        alt={news.titulo || "Noticia"}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {news.titulo}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", marginBottom: 1 }}
                        >
                            {news.categoria} · {fecha}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Fade>
    );
};

export default NewsPageCard;
