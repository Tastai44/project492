import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TagIcon from "@mui/icons-material/Tag";

interface IData {
  eventId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  title: string;
  coverPhoto: string[];
  topic: string;
  ageRage: number;
}

export default function ProCoverImage({eventId, startDate, startTime, endDate, endTime, title, coverPhoto, topic, ageRage} : IData) {
  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        {coverPhoto.map((cover, index) => (
          <CardMedia key={index} sx={{ height: 300 }} image={cover} title="green iguana" />
        ))}
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
            <Box
              sx={{ mt: 1, ml:1, display: "flex", justifyContent: "flex-start", fontSize:"20px" }}
            >
              {title}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box sx={{ml:1}}>
                <Button color="error" startIcon={<LocationOnIcon />}>
                  Location
                </Button>
              </Box>
              <Box sx={{ display: "flex" }}>
                <IconButton size="large">
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
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems:"center" }}>
                <DateRangeIcon />
                <div>Start: {startDate} {startTime}, End: {endDate} {endTime}</div>
              </Box>
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems:"center" }}>
                {/* <TagIcon /> */}
                <div>{topic} | {ageRage}+</div>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}
