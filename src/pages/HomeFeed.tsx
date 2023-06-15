import * as React from "react";
import Grid from "@mui/material/Grid";
import LeftSide from "../components/LeftSide";
import { styled } from "@mui/material/styles";
import MContainer from "../components/MContainer/MContainer";
import RightContainer from "../components/RightSide/RightContainer";
import PostForm from "../components/MContainer/PostForm";
import Box from "@mui/material/Box/Box";

import { db } from "../config/firebase";
import { get, ref } from "firebase/database";
import { Post } from "../interface/PostContent";

export default function HomeFeed() {
  const Item = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));

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

  return (
    <>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
          >
            <Grid item xs={2}>
              <Box style={{ position: "fixed" }}>
                <LeftSide />
              </Box>
            </Grid>

            <Grid item xs={7}>
              <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                <PostForm />
              </Item>
              <Item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                      likeNumber={m.likeNumber}
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
