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
  Divider,
  ImageList,
  ImageListItem,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import Luffy from "../../../public/pictures/Luffy.webp";

import TextField from "@mui/material/TextField";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CommentIcon from "@mui/icons-material/Comment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import emojiData from "emoji-datasource-facebook";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface data {
  caption: string;
  hashTagTopic: string;
  status: string;
  createAt: string;
  photoPost: string[];
  emoji?: string;
  likeNumber: number;
}

export default function MContainer({
  caption,
  hashTagTopic,
  status,
  createAt,
  emoji,
  photoPost,
  likeNumber,
}: data) {
  const [iconStatus, setIconStatus] = React.useState("");
  React.useEffect(() => {
    if (status === "Private") {
      setIconStatus("LockIcon");
    } else if (status === "Friend") {
      setIconStatus("GroupIcon");
    } else if (status === "Public") {
      setIconStatus("PublicIcon");
    }
  }, [iconStatus, status]);

  const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
    const emoji = emojiData.find((data) => data.unified === emojiCode);
    return emoji ? emoji.name : undefined;
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
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
                  <b>User Name</b>
                  {emoji && (
                    <>
                      is feeling {String.fromCodePoint(parseInt(emoji, 16))}{" "}
                      {convertEmojiCodeToName(emoji)}
                    </>
                  )}
                </Typography>
              }
              secondary={
                <Box sx={{ display: "flex", alignItems: "end", gap: 2 }}>
                  {createAt}
                  <Box sx={{ display: "flex", alignItems: "end" }}>
                    {iconStatus === "LockIcon" && <LockIcon />}
                    {iconStatus === "GroupIcon" && <GroupIcon />}
                    {iconStatus === "PublicIcon" && <PublicIcon />}
                    {status}
                  </Box>
                </Box>
              }
            />
            <ListItemAvatar>
              <IconButton onClick={handleOpenUserMenu}>
                <MoreHorizIcon />
              </IconButton>
              <Menu
                sx={{ mt: "30px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" sx={{display:"flex", gap:1,alignItems:"start", fontSize:"18px"}}><BorderColorOutlinedIcon /> Edit</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" sx={{display:"flex", gap:1,alignItems:"start", fontSize:"18px"}}><DeleteOutlineOutlinedIcon /> Delete</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" sx={{display:"flex", gap:1,alignItems:"start", fontSize:"18px"}}><FlagOutlinedIcon /> Report</Typography>
                </MenuItem>
              </Menu>
            </ListItemAvatar>
          </ListItem>

          <CardContent>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "justify" }}
            >
              {caption}
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
            {hashTagTopic}
          </Typography>

          <ImageList
            sx={{ width: "100%", height: "auto", maxHeight: "500px" }}
            cols={3}
            rowHeight={300}
          >
            {photoPost.map((image, index) => (
              <ImageListItem key={index}>
                <img src={image} alt={`Preview ${index}`} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>

          <CardActions
            disableSpacing
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button aria-label="add to favorites" sx={{ color: "purple" }}>
              <ThumbUpIcon sx={{ marginRight: 1 }} /> Like
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
            <Button aria-label="add to favorites" sx={{ color: "red" }}>
              <ThumbUpIcon sx={{ marginRight: 1 }} /> {likeNumber}
            </Button>
            <div>
              <Button aria-label="add to favorites" sx={{ color: "grey" }}>
                100 Comments
              </Button>
              <Button aria-label="add to favorites" sx={{ color: "grey" }}>
                100 Shares
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
              gap: "10px",
            }}
          >
            <Avatar
              alt="User"
              src={Luffy}
              sx={{ width: "45px", height: "45px" }}
            />
            <div style={{ width: "98%" }}>
              <TextField
                id="outlined-basic"
                label="Comment something..."
                variant="outlined"
                multiline
                maxRows={4}
                sx={{ width: "99%" }}
              />
            </div>
          </div>
        </Item>
      </Stack>
    </Box>
  );
}
