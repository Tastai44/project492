import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Stack, Typography } from "@mui/material";
import ProLeftside from "../../components/Profile/ProLeftside";
import ProCoverImage from "../../components/Profile/ProCoverImage";
import MContainer from "../../components/MContainer/MContainer";
import PostForm from "../../components/MContainer/PostForm";
import { useParams } from "react-router-dom";

import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { Post } from "../../interface/PostContent";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function Blog() {
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
      <Grid sx={{ flexGrow: 1 }} container marginTop={5}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
            spacing={10}
          >
            <Grid item xs={2}>
              <Item sx={{ backgroundColor: "#EEECEF" }}>
                <ProLeftside />
              </Item>
            </Grid>

            <Grid item xs={10}>
              <Item>
                <Box sx={{ width: "100%" }}>
                  <Stack spacing={2}>
                    <Item>
                      <ProCoverImage />
                    </Item>
                    <Item>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={9}>
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
                                  I am a keen, hard working, reliable and
                                  excellent time keeper. I am a bright and
                                  receptive person, able to communicate well
                                  with people at all levels. approach.
                                </Typography>
                              </Paper>
                            </Item>
                          </Grid>
                        </Grid>
                      </Box>
                    </Item>
                  </Stack>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
