import * as React from "react";
import { styled } from "@mui/material/styles";
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

interface IData {
  inFoUser: User[];
}

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function Blog({ inFoUser }: IData) {
  const { userId } = useParams();

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
