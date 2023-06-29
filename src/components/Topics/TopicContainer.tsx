import * as React from "react";
import Box from "@mui/material/Box";

import EachTopic from "./EachTopic";
import { Typography, Button, Divider, Modal, Paper } from "@mui/material";
import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Like, Post } from "../../interface/PostContent";
import Content from "../MContainer/Content";
import { styleBoxPop } from "../../utils/styleBox";

export default function TopicContainer() {
  const [userId, setUserId] = React.useState("");
  React.useEffect (() => {
    const getUerInfo = localStorage.getItem("user");
    const tmp = JSON.parse(getUerInfo ? getUerInfo : '')
    setUserId(tmp.uid)
  }, [])

  const [dataPost, setPosts] = React.useState<Post[]>([]);
  const [postId, setPostId] = React.useState("");
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "posts"),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) => doc.data() as Post
        );
        setPosts(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [openPost, setOpenPost] = React.useState(false);
  const [likes, setLikes] = React.useState<Like[]>([])
  const handletOpenPost = (id:string, likeData:Like[]) => {
    setOpenPost(true)
    setPostId(id);
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
              userId={userId}
              handleClosePost={handleClosePost}
              likes={likes}
            />
          </Paper>
        </Box>
      </Modal>
      <Box sx={{ width: "100%", bgcolor: "background.paper", color: "black" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Typography variant="h4">Topics</Typography>
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <Button
              sx={{
                fontSize: "16px",
                "&:hover": { backgroundColor: "#e8e8e8", color:"black" },
                borderRadius: "10px",
                backgroundColor: "#A020F0",
                padding: "5px",
                color: "#fff",
              }}
            >
              Daily
            </Button>
            <Button
              sx={{
                fontSize: "16px",
                "&:hover": { backgroundColor: "#e8e8e8", color:"black" },
                borderRadius: "10px",
                backgroundColor: "#BD68F2",
                padding: "5px",
                color: "#fff",
              }}
            >
              Weekly
            </Button>
            <Button
              sx={{
                fontSize: "16px",
                "&:hover": { backgroundColor: "#e8e8e8", color:"black" },
                borderRadius: "10px",
                backgroundColor: "#8E51E2",
                padding: "5px",
                color: "#fff",
              }}
            >
              Monthly
            </Button>
          </div>
        </div>
        <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
        {dataPost.map((posts) => (
          <Box 
            key={posts.id} 
            onClick={() => handletOpenPost(posts.id, posts.likes)}
          >
            <EachTopic hashTag={posts.hashTagTopic}/>
          </Box>
        ))}
        
      </Box>
    </div>
  );
}
