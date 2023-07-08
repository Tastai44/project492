import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";
import MessageIcon from '@mui/icons-material/Message';
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  mt: 1,
                  ml: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  fontSize: "20px",
                }}
              >
                Name of the Group
              </Box>
              <Box sx={{ display: "flex", pt:1, pb:1 }}>
                <IconButton size="large">
                  <ShareIcon sx={{width:"20px"}}/>
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
                  startIcon={<MessageIcon />}
                >
                  Chatting
                </Button>
              </Box>
            </Box>
            <Divider light sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                <DateRangeIcon />
                <div>Sun 15 Dec at 4:00 AM</div>
              </Box>
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                <TagIcon />
                <div>Name of the topic | 18+</div>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}