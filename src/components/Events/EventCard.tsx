import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import Luffy from "../../../public/pictures/Luffy.webp";
import { Avatar, Box, Button, IconButton } from "@mui/material";

import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { NavLink } from "react-router-dom";

interface IData {
  eventId: string;
  startDate: string;
  startTime: string;
  title: string;
  endDate: string;
  endTime: string;
  coverPhoto: string[];
}

export default function MediaCard({eventId, startDate, startTime, title, coverPhoto, endDate, endTime}:IData) {

  return (
    <Card sx={{ width: 258, height: 400 }}>
      <NavLink to={`/eventsDetail/${eventId}`}>
        {coverPhoto.map((cover, index) => (
          <CardMedia key={index} sx={{ height: 194 }} image={cover} title="green iguana" />
        ))}
      </NavLink>
      <CardContent sx={{ textAlign: "justify" }}>
        <Typography gutterBottom sx={{ fontSize: "18px" }} component="div">
          {title}
        </Typography>
        <Typography color={"error"}><b>Start:</b> {startDate}, {startTime} <br />
         <b>End:</b> {endDate}, {endTime}</Typography>
        <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
          <Avatar
            src={Luffy}
            sx={{ width: "30px", height: "30px", marginTop: 2 }}
            aria-label="recipe"
          />
          <Typography>
            <b>Created by: </b>
            Username
          </Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: -1,
          alignItems: "center",
        }}
      >
        <Button sx={{ color: "black" }} startIcon={<StarBorderOutlinedIcon />}>
          Interest
        </Button>

        <Button sx={{ color: "black" }} startIcon={<ScreenShareIcon />}>
          Share
        </Button>

        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
