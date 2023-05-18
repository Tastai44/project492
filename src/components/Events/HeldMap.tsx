import { CardMedia, Paper, Typography } from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function HeldMap() {
  return (
    <div>
      <Paper>
        <Typography
          sx={{
            fontSize: "16px",
            textAlign: "left",
            padding: "5px",
            fontWeight: "bold",
          }}
        >
          Location
        </Typography>
        <Typography
          sx={{
            textAlign: "left",
            padding: "10px",
            color: "#727272",
          }}
        >
          Angkaew Reservoir RX42+535 ซอย สุโขทัย 5 Tambon Su Thep, Mueang Chiang
          Mai District, Chiang Mai 50200
        </Typography>
      </Paper>

      <Paper sx={{mt:1}}>
        <Typography
          sx={{
            fontSize: "16px",
            textAlign: "left",
            padding: "5px",
            fontWeight: "bold",
          }}
        >
          Map
        </Typography>
        <Typography
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
        </Typography>
      </Paper>
    </div>
  );
}
