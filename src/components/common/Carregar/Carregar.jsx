
import { CircularProgress, Box, Typography } from "@mui/material";

export default function Carregar({ texto = "Carregando..." }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <CircularProgress />
      <Typography variant="body2" mt={2} color="textSecondary">
        {texto}
      </Typography>
    </Box>
  );
}
