import { Box, Button, Card, CardMedia } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Luffy from "../../../public/pictures/Luffy.webp";

export default function ProCoverImage() {
  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia sx={{ height: 300 }} image={Luffy} title="green iguana" />
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: "-4%",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Button
          sx={{
            backgroundColor: "white",
            color: "black",
            "&:hover": {
              color: "white",
              backgroundColor: "black",
            },
          }}
          variant="outlined"
          startIcon={<AddAPhotoIcon />}
        >
          Add cover photo
        </Button>
      </Box>
    </div>
  );
}
