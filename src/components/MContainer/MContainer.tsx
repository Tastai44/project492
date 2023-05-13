import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";

import TextField from "@mui/material/TextField";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PostForm from "./PostForm";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function MContainer() {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        <Item>
          <PostForm />
        </Item>

        <Item sx={{ display: "flex", flexDirection: "column" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                src={Luffy}
                sx={{ width: "60px", height: "60px", marginRight: "10px" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: "16px" }}>
                  <b>User Name</b> is feeling happy 😁 with something
                </Typography>
              }
              secondary="Jan 9, 2014"
            />
            <ListItemAvatar>
              <MoreHorizIcon />
            </ListItemAvatar>
          </ListItem>

          <CardContent>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "justify" }}
            >
              This impressive paella is a perfect party dish and a fun meal to
              cook together with your guests. Add 1 cup of frozen peas along
              with the mussels, if you like.
            </Typography>
          </CardContent>
          <Typography
            sx={{
              fontSize: "16px",
              display: "flex",
              justifyContent: "start",
              margin: 1,
            }}
          >
            #hastage
          </Typography>

          <CardMedia
            component="img"
            height="300px"
            image={Luffy}
            alt="Paella dish"
          />

          <CardActions
            disableSpacing
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button aria-label="add to favorites" sx={{ color: "purple" }}>
              <ThumbUpOffAltIcon sx={{ marginRight: 1 }} /> Like
            </Button>
            <Button aria-label="add to favorites">
              <CommentIcon sx={{ marginRight: 1 }} /> Comment
            </Button>
            <Button aria-label="share" sx={{ color: "black" }}>
              <ScreenShareIcon sx={{ marginRight: 1 }} /> Share
            </Button>
          </CardActions>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />

          <CardActions
            disableSpacing
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button aria-label="add to favorites" sx={{color:"red"}}>
              <FavoriteIcon /> 100
            </Button>
            <div>
              <Button aria-label="add to favorites" sx={{color:"grey"}}>
                100 Comments
              </Button>
              <Button aria-label="add to favorites" sx={{color:"grey"}}>
                100 Share
              </Button>
            </div>
          </CardActions>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              marginBottom: 10,
            }}
          >
            <Avatar
              alt="User"
              src={Luffy}
              sx={{ width: "50px", height: "50px" }}
            />
            <div>
              <TextField
                id="outlined-basic"
                label="Comment something..."
                variant="outlined"
                multiline
                maxRows={4}
                sx={{ width: "90vh" }}
              />
            </div>
          </div>
        </Item>
      </Stack>
    </Box>
  );
}
