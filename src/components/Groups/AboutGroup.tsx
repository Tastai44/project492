import { Box,Paper } from "@mui/material";
export default function AboutGroup() {
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
          About The Group
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
    </div>
  );
}
