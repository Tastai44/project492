import { Box, CardMedia, Paper } from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function HeldMap() {
  return (
    <div>
      <Paper>
        <Box
          sx={{
            fontSize: "16px",
            textAlign: "left",
            padding: "5px",
            fontWeight: "bold",
          }}
        >
          Location
        </Box>
        <Box
          sx={{
            textAlign: "left",
            padding: "10px",
            color: "#727272",
          }}
        >
          Angkaew Reservoir RX42+535 ซอย สุโขทัย 5 Tambon Su Thep, Mueang Chiang
          Mai District, Chiang Mai 50200
        </Box>
      </Paper>

      <Paper sx={{mt:1}}>
        <Box
          sx={{
            fontSize: "16px",
            textAlign: "left",
            padding: "5px",
            fontWeight: "bold",
          }}
        >
          Map
        </Box>
        <Box
          sx={{
            textAlign: "left",
            padding: "10px",
            color: "#727272",
          }}
        >
          <CardMedia
            component="img"
            height={155}
            image={Luffy}
            alt="Host"
          />
        </Box>
      </Paper>
    </div>
  );
}
