// src/components/Prateleira/CardDisplay/CardDisplay.jsx
import { IconButton, Box, CardMedia, Tooltip } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatPrice } from "../../../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import styles from "./CardDisplay.module.css";

/**
 * Card de Produto — visão pública + admin (hover revela ações)
 */
export default function CardDisplay({
  id,
  imageSrc,
  title,
  rating = 0,
  isFavorite = false,
  isNew = false,
  originalPrice = "",
  price = "",
  discount = "",
  stock = 0,           // <-- novo
  isDeleting = false,

  // flags
  adminMode = false,
  disableNavigation = false,

  // callbacks
  onBuyClick = () => {},
  onCartClick = () => {},
  onEditClick = () => {},
  onDeleteClick = () => {},
  onToggleFavorite = () => {},
  onSetRating = () => {},
  onNavigate, // opcional
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (disableNavigation) return;
    if (typeof onNavigate === "function") onNavigate(id);
    else navigate(`/produtos/${id}`);
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`Produto ${title}`}
    >
      {/* Topo: tags + favorito (somente público) */}
      <Box className={styles.topBox}>
        <Box className={styles.tags}>
          {isNew && <div className={styles.chipYellow}>Novidade</div>}
          {discount && <div className={styles.chipBlue}>{`${discount}% off`}</div>}
        </Box>

        {!adminMode && (
          <Tooltip title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <IconButton
              onClick={(e) => {
                stop(e);
                onToggleFavorite();
              }}
              className={styles.favoriteButton}
              aria-label="Marcar como favorito"
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Imagem */}
      <Box className={styles.imageContainer}>
        <CardMedia component="img" className={styles.cardMedia} image={imageSrc} alt={title} />
      </Box>

      {/* Conteúdo */}
      <div className={styles.cardContent}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      {/* Preço + Estoque discreto */}
      <div className={styles.priceAndButtons}>
        <div className={styles.priceBlock}>
          {originalPrice && originalPrice !== price && (
            <span className={styles.oldPrice}>{formatPrice(originalPrice)}</span>
          )}
          <span className={styles.newPrice}>{formatPrice(price)}</span>
        </div>

        {/* Substitui a área dos botões por uma “pílula” de estoque */}
        <div
          className={styles.stockPill}
          title={stock > 0 ? `Em estoque: ${stock}` : "Sem estoque"}
          onClick={stop}
        >
          {stock > 0 ? `Estoque: ${stock}` : "Sem estoque"}
        </div>
      </div>

      {/* Ações administrativas (só no admin), reveladas no hover */}
      {/* Por enquanto é true - mas é para recener isso da variavel adminMode:true || false  */}
      {true && (
        <Box className={styles.editDeleteButtons}>
          <Tooltip title="Editar">
            <IconButton
              className={styles.actionBtn}
              onClick={(e) => {
                stop(e);
                onEditClick();
              }}
              aria-label="Editar produto"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={isDeleting ? "Excluindo..." : "Excluir"}>
            {/* span para permitir tooltip em botão desabilitado */}
            <span>
              <IconButton
                className={styles.actionBtn}
                onClick={(e) => {
                  stop(e);
                  onDeleteClick();
                }}
                disabled={isDeleting}
                aria-label="Excluir produto"
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
    </div>
  );
}
