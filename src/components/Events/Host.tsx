import {
  Paper,
  Button,
  Divider,
  CardMedia,
  Box,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function Host() {
  return (
    <div>
      <Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ p: 1, fontSize: "20px", fontWeight: "bold" }}>
            Host
          </Box>
          <Button
            sx={{
              backgroundColor: "#8E51E2",
              color: "white",
              "&:hover": {
                color: "black",
                backgroundColor: "#E9E8E8",
              },
              m: 1,
            }}
            // onClick={handleOpen}
          >
            Add Friend
          </Button>
        </Box>
        <Divider light />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CardMedia
            component="img"
            sx={{ width: "90%", m: 1 }}
            image={Luffy}
            alt="Host"
          />
        </Box>
        <Divider light />
        <Box sx={{m:1}}>Fristname LastName</Box>
      </Paper>
    </div>
  );
}
