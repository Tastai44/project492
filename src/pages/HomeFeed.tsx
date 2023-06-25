import * as React from "react";
import Grid from "@mui/material/Grid";
import LeftSide from "../components/LeftSide";
import { styled } from "@mui/material/styles";
import MContainer from "../components/MContainer/MContainer";
import RightContainer from "../components/RightSide/RightContainer";
import PostForm from "../components/MContainer/PostForm";
import Box from "@mui/material/Box/Box";

import { dbFireStore } from "../config/firebase";
import {collection, query, orderBy, getDocs} from "firebase/firestore"
import { Post } from "../interface/PostContent";


export default function HomeFeed() {
  const Item = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));

  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh(pre => (pre+1));
  }

  const [data, setData] = React.useState<Post[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(dbFireStore, 'posts'), orderBy('createAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
        setData(queriedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [reFresh]);


  return (
    <>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
          >
            <Grid item xs={2}>
              <Box style={{ position: "fixed" }}>
                <LeftSide />
              </Box>
            </Grid>

            <Grid item xs={7}>
              <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                <PostForm handdleReFresh={handleRefresh} />
              </Item>
              <Item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {data.map((m) => (
                  <Box key={m.id}>
                    <MContainer
                      owner={m.owner}
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

            <Grid item xs={2}>
              <Box style={{ position: "fixed" }}>
                <RightContainer />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
