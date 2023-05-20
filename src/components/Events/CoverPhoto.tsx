import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";

export default function ProCoverImage() {
  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        <CardMedia sx={{ height: 300 }} image={Luffy} title="green iguana" />
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-50px",
        }}
      >
        <Card sx={{ width: "95%", backgroundColor: "white", display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Typography
              sx={{ p: 1, display: "flex", justifyContent: "flex-start" }}
            >
              Name of the event
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box>
                <Button color="error" startIcon={<LocationOnIcon />}>
                  Location
                </Button>
              </Box>
              <Box sx={{ display: "flex" }}>
                <IconButton>
                  <ShareIcon />
                </IconButton>
                <Button
                  sx={{
                    mr: 1,
                    backgroundColor: "#8E51E2",
                    color: "white",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "#E9E8E8",
                    },
                    m: 1,
                  }}
                  startIcon={<FavoriteIcon />}
                >
                  Interested
                </Button>
              </Box>
            </Box>
            <Divider light sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ display: "flex", gap: 1, m: 1 }}>
                <DateRangeIcon />
                <div>Sun 15 Dec at 4:00 AM</div>
              </Typography>
              <Typography sx={{ display: "flex", gap: 1, m: 1 }}>
                <TagIcon />
                <div>Name of the topic | 18+</div>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}
