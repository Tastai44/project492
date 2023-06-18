import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Luffy from "../../../public/pictures/Luffy.webp";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CardContent,
  ImageList,
  ImageListItem,
  TextField,
  Button,
  CardActions,
} from "@mui/material";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CommentIcon from "@mui/icons-material/Comment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { Post } from "../../interface/PostContent";
import { get, ref } from "firebase/database";
import { db } from "../../config/firebase";
import emojiData from "emoji-datasource-facebook";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import CancelIcon from "@mui/icons-material/Cancel";
import Divider from "@mui/material/Divider";
import CommentContent from "./CommentContent";

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface IData {
  postId: string;
  iconStatus: string;
}
interface IFunction {
  handleClosePost: () => void;
}

export default function Content({
  postId,
  iconStatus,
  handleClosePost,
}: IData & IFunction) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [data, setData] = React.useState<Post[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(db, "/posts");
        const snapshot = await get(dbRef);
        const val = snapshot.val();
        if (val) {
          setData(Object.values(val));
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const convertEmojiCodeToName = (emojiCode: string): string | undefined => {
    const emoji = emojiData.find((data) => data.unified === emojiCode);
    return emoji ? emoji.name : undefined;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={handleClosePost}>
          <CancelIcon />
        </IconButton>
      </Box>
      {data
        .filter((f) => f.id === postId)
        .map((m) => (
          <Box key={m.id} sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Item>
                  <Box sx={{ height: "auto", maxWidth:'lg', minWidth:'sm'}}>
                    <ImageList variant="masonry" cols={2} gap={10}>
                      {m.photoPost.map((image, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={image}
                            srcSet={image}
                            alt={`${index}`}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            src={Luffy}
                            sx={{
                              width: "60px",
                              height: "60px",
                              marginRight: "10px",
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontSize: "16px" }}>
                              <b>User Name</b>
                              {m.emoji && (
                                <>
                                  is feeling
                                  {String.fromCodePoint(
                                    parseInt(m.emoji, 16)
                                  )}{" "}
                                  {convertEmojiCodeToName(m.emoji)}
                                </>
                              )}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {m.createAt}
                              {iconStatus === "LockIcon" && <LockIcon />}
                              {iconStatus === "GroupIcon" && <GroupIcon />}
                              {iconStatus === "PublicIcon" && <PublicIcon />}
                              {m.status}
                            </Typography>
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
                              <Typography
                                textAlign="center"
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "start",
                                  fontSize: "18px",
                                }}
                              >
                                <BorderColorOutlinedIcon /> Edit
                              </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                              <Typography
                                textAlign="center"
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "start",
                                  fontSize: "18px",
                                }}
                              >
                                <DeleteOutlineOutlinedIcon /> Delete
                              </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                              <Typography
                                textAlign="center"
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "start",
                                  fontSize: "18px",
                                }}
                              >
                                <FlagOutlinedIcon /> Report
                              </Typography>
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
                          {m.caption}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          fontSize: "16px",
                          display: "flex",
                          justifyContent: "start",
                          margin: 1,
                        }}
                      >
                        {m.hashTagTopic}
                      </Box>
                    </Box>
                    <Divider />
                    <CardActions
                      disableSpacing
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Button
                        aria-label="add to favorites"
                        sx={{ color: "purple" }}
                      >
                        <ThumbUpIcon sx={{ marginRight: 1 }} /> Like
                      </Button>
                      <Button aria-label="add to favorites">
                        <CommentIcon sx={{ marginRight: 1 }} /> Comment
                      </Button>
                      <Button aria-label="share" sx={{ color: "black" }}>
                        <ScreenShareIcon sx={{ marginRight: 1 }} /> Share
                      </Button>
                    </CardActions>
                    <Divider />
                    <Box
                      sx={{ mt: 2, mb: 2, height: '350px', maxHeight:'500px', overflowY: 'scroll' }}
                    >
                      <CommentContent />
                      <CommentContent />
                      <CommentContent />
                      <CommentContent />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "space-evenly",
                        mt: 2,
                        gap: "10px",
                      }}
                    >
                      <Avatar
                        alt="User"
                        src={Luffy}
                        sx={{ width: "45px", height: "45px" }}
                      />
                      <Box sx={{ width: "98%", mb: 2 }}>
                        <TextField
                          size="small"
                          id="outlined-basic"
                          label="Comment something..."
                          variant="outlined"
                          multiline
                          maxRows={4}
                          sx={{ width: "99%" }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Item>
              </Grid>
            </Grid>
          </Box>
        ))}
    </Box>
  );
}
