import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import MContainer from "../../components/MContainer/MContainer";
import PostForm from "../../components/MContainer/PostForm";
import { useParams } from "react-router-dom";

import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { Post } from "../../interface/PostContent";
import { User } from "../../interface/User";
import { Item } from "../../App";

interface IData {
  reFreshInfo: number;
}

export default function Blog({reFreshInfo} : IData) {
  const { userId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  const [reFresh, setReFresh] = React.useState(0);

  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };
  const [data, setData] = React.useState<Post[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "posts"),
          where("owner", "==", userId),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
        setData(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reFresh, userId]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userInfo.uid)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) =>
            ({
              uid: doc.id,
              ...doc.data(),
            } as User)
        );
        setInFoUser(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo.uid, reFreshInfo]);

  return (
    <div>
      {inFoUser.map((m) => (
        <Box sx={{ flexGrow: 1 }} key={m.uid}>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                <PostForm handdleReFresh={handleRefresh} inFoUser={inFoUser} />
              </Item>
              <Item
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {data.map((m) => (
                  <Box key={m.id}>
                    <MContainer
                      onwer={m.owner}
                      postId={m.id}
                      caption={m.caption}
                      hashTagTopic={m.hashTagTopic}
                      status={m.status}
                      createAt={m.createAt}
                      emoji={m.emoji}
                      photoPost={m.photoPost}
                      likeNumber={m.likes.length}
                      likes={m.likes}
                      commentNumber={m.comments.length}
                      handleRefresh={handleRefresh}
                    />
                  </Box>
                ))}
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Paper>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      textAlign: "left",
                      padding: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    About me
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "left",
                      padding: "10px",
                      color: "#727272",
                    }}
                  >
                    {m.aboutMe}
                  </Typography>
                </Paper>
              </Item>
            </Grid>
          </Grid>
        </Box>
      ))}
    </div>
  );
}
