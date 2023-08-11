import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";
import {
  Divider,
  ImageList,
  ImageListItem,
  Modal,
  Paper,
} from "@mui/material";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Navigation";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { useParams } from "react-router-dom";
import { dbFireStore } from "../../config/firebase";
import { Like, Post } from "../../interface/PostContent";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import Content from "../../components/MContainer/Content";
import { styleBoxPop } from "../../utils/styleBox";


export default function Collections() {
  const { userId } = useParams();
  const [postData, setPostData] = React.useState<Post[]>([]);
  const [openPost, setOpenPost] = React.useState(false);
  const [likes, setLikes] = React.useState<Like[]>([]);
  const [postId, setPostId] = React.useState("");
  const [ownerId, setOwnerId] = React.useState("");
  
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  React.useEffect(() => {
    const queryData = query(
      collection(dbFireStore, "posts"),
      where("owner", "==", userId),
      orderBy("createAt", "desc")
    );

    const unsubscribe = onSnapshot(
      queryData,
      (snapshot) => {
        const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
        setPostData(queriedData);
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  
    return () => {
      unsubscribe();
    };
  }, [userId]);

  const handletOpenPost = (id: string, likeData: Like[], ownerId: string) => {
    setOpenPost(true);
    setPostId(id);
    setOwnerId(ownerId);
    setLikes(likeData);
  };
  const handleClosePost = () => {
    setOpenPost(false);
  };

  return (
    <div>
      <Modal
        open={openPost}
        onClose={handleClosePost}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Paper sx={styleBoxPop}>
            <Content
              postId={postId}
              likes={likes}
              userId={userInfo.uid}
              handleClosePost={handleClosePost}
              owner={ownerId}
            />
          </Paper>
        </Box>
      </Modal>

      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ m: 1, fontSize: "20px" }}>Collections</Box>
            <Search
              sx={{
                backgroundColor: "#F1F1F1",
                m: 1,
                "&:hover": { backgroundColor: "#C5C5C5" },
              }}
            >
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>
          <Divider light sx={{ background: "grey", mb: 1 }} />
          <Grid sx={{ flexGrow: 1, gap: 1 }} container>
            <ImageList
              sx={{
                width: "100%",
                m:1
              }}
              cols={4}
            >
              {postData.map((m) =>
                m.photoPost.map((img, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => handletOpenPost(m.id, m.likes, m.owner)}
                  >
                    <img src={img} alt={`Preview ${index}`} loading="lazy" />
                  </ImageListItem>
                ))
              )}
            </ImageList>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
}
