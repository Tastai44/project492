import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import Luffy from "../../../public/pictures/Luffy.webp";
import { Avatar, IconButton } from "@mui/material";

import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function MediaCard() {
  return (
    <Card sx={{ width: 258, height: 370 }}>
      <CardMedia sx={{ height: 194 }} image={Luffy} title="green iguana" />
      <CardContent sx={{ textAlign: "justify" }}>
        <Typography gutterBottom sx={{ fontSize: "18px" }} component="div">
          I believe I can fly — USA
        </Typography>
        <Typography color={"error"}>Mon, 11 JUL AT 23.59</Typography>
        <Avatar
          src={Luffy}
          sx={{ width: "30px", height: "30px", marginTop: 2 }}
          aria-label="recipe"
        />
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: -1,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton>
            <StarBorderOutlinedIcon />
          </IconButton>
          <div>Interest</div>
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton>
            <ScreenShareIcon />
          </IconButton>
          <div>Share</div>
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </div>

      </CardActions>
    </Card>
  );
}
