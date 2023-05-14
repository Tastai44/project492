import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Luffy from "../../../public/pictures/Luffy.webp";
import { Button } from "@mui/material";

export default function MemberCard() {
  return (
    <Card sx={{ width: 250 }}>
      <CardActions disableSpacing sx={{display:"flex", justifyContent:"center", gap:1 ,background:"#A005FF"}}>
        <Button sx={{color:"white", borderRadius:"5px", backgroundColor:"#F516FA"}}>Add Friend</Button>
        <Button sx={{color:"white", borderRadius:"5px", backgroundColor:"red"}}>UnKnow</Button>
      </CardActions>
      <CardMedia component="img" height="194" image={Luffy} alt="Paella dish" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{fontSize:"20px"}}>
          Tastai Khianjai
        </Typography>
      </CardContent>
    </Card>
  );
}
