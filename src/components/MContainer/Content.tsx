import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
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


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface IData {
  postId: string;
}

export default function Content({
  postId,
}: IData) {
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
    <>
    {data.filter((f)=> f.id === postId).map((m)=> (
    <Box key={m.id} sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Item>ImageList</Item>
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
                        is feeling {String.fromCodePoint(parseInt(m.emoji, 16))}{" "}
                        {convertEmojiCodeToName(m.emoji)}
                      </>
                    )}
                      </Typography>
                    }
                    // secondary={
                    //   <Box sx={{ display: "flex", alignItems: "end", gap: 2 }}>
                    //     {createAt}
                    //     <Box sx={{ display: "flex", alignItems: "end" }}>
                    //       {iconStatus === "LockIcon" && <LockIcon />}
                    //       {iconStatus === "GroupIcon" && <GroupIcon />}
                    //       {iconStatus === "PublicIcon" && <PublicIcon />}
                    //       {status}
                    //     </Box>
                    //   </Box>
                    // }
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
              </Box>
              <Box>Top</Box>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
    ))}
    </>
  );
}
