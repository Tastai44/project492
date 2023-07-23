import * as React from "react";
import Box from "@mui/material/Box";

import EachTopic from "./EachTopic";
import {
  Typography,
  Divider,
  Modal,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { Like, Post } from "../../interface/PostContent";
import Content from "../MContainer/Content";
import { styleBoxPop } from "../../utils/styleBox";

export default function TopicContainer() {
  const [userId, setUserId] = React.useState("");
  const [dateType, setDateType] = React.useState("All");
  const [dataPost, setPosts] = React.useState<Post[]>([]);
  const [postId, setPostId] = React.useState("");
  const [reFresh, setReFresh] = React.useState(0);
  const [openPost, setOpenPost] = React.useState(false);
  const [likes, setLikes] = React.useState<Like[]>([]);

  React.useEffect(() => {
    const getUerInfo = localStorage.getItem("user");
    const tmp = JSON.parse(getUerInfo ? getUerInfo : "");
    setUserId(tmp.uid);
  }, []);

  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "posts"),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reFresh]);

  const handletOpenPost = (id: string, likeData: Like[]) => {
    setOpenPost(true);
    setPostId(id);
    setLikes(likeData);
  };
  const handleClosePost = () => {
    setOpenPost(false);
  };

  const handleDaily = () => {
    const today = new Date().toLocaleDateString("en-US");
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "posts"),
          where("date", "==", today)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  const handleWeekly = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
  
    firstDayOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  
    const fetchWeeklyData = async () => {
      try {
        const startDate = firstDayOfWeek.toLocaleDateString("en-US");
        const endDate = lastDayOfWeek.toLocaleDateString("en-US");

        const q = query(
          collection(dbFireStore, "posts"),
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchWeeklyData();
  };

  const handleMonthly = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    const fetchData = async () => {
      try {
        const startOfMonth = firstDayOfMonth.toLocaleDateString("en-US");
        const endOfMonth = lastDayOfMonth.toLocaleDateString("en-US");
        const q = query(
          collection(dbFireStore, "posts"),
          where("date", ">=", startOfMonth),
          where("date", "<=", endOfMonth)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  const handleDateType = (e: SelectChangeEvent) => {
    setDateType(e.target.value as string);
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
              likes={likes}
              handleClosePost={handleClosePost}
              handleRefreshData={handleRefresh}
            />
          </Paper>
        </Box>
      </Modal>
      <Box sx={{ width: "100%", bgcolor: "background.paper", color: "black" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Typography variant="h4">Topics</Typography>
          <Box
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">D/W/M</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dateType}
                label="D/W/M"
                onChange={handleDateType}
              >
                <MenuItem onClick={handleRefresh} value={"All"}>
                  All
                </MenuItem>
                <MenuItem onClick={handleDaily} value={"Daily"}>
                  Daily
                </MenuItem>
                <MenuItem onClick={handleWeekly} value={"Weekly"}>
                  Weekly
                </MenuItem>
                <MenuItem onClick={handleMonthly} value={"Monthly"}>
                  Monthly
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
        {dataPost.map((posts) => (
          <Box
            key={posts.id}
            onClick={() => handletOpenPost(posts.id, posts.likes)}
          >
            <EachTopic hashTag={posts.hashTagTopic} />
          </Box>
        ))}
      </Box>
    </div>
  );
}
