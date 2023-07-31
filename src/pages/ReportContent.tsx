import { Box, Grid, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Item } from "../App";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../components/Navigation";
import React from "react";
import "firebase/database";
import { collection, orderBy, getDocs, query } from "firebase/firestore";
import { dbFireStore } from "../config/firebase";
import { Post } from "../interface/PostContent";
import Content from "../components/Report/Content";

export default function ReportContent() {
  const [reFresh, setReFresh] = React.useState(0);
  const [postData, setPostData] = React.useState<Post[]>([]);

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
        setPostData(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reFresh]);
  return (
    <Box sx={{ width: "100%", marginTop: 7 }}>
      <Stack spacing={2}>
        <Item
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "30px", color: "#920EFA", fontWeight: 500 }}>
            Report Contents
          </div>
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
        </Item>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid item xs={10}>
            {postData.some((s) => s.reportPost.length !== 0) ? (
              <>
                {postData
                  .filter((item) => item.reportPost.length !== 0)
                  .map((post) => (
                    <Content
                      onwer={post.owner}
                      postId={post.id}
                      caption={post.caption}
                      hashTagTopic={post.hashTagTopic}
                      status={post.status}
                      createAt={post.createAt}
                      emoji={post.emoji}
                      photoPost={post.photoPost}
                      groupName={post.groupName}
                      groupId={post.groupId}
                      reportNumber={post.reportPost.length}
                      handleRefresh={handleRefresh}
                      reFreshInfo={0}
                      reportPost={post.reportPost}
                    />
                  ))}
              </>
            ) : (
              <Typography variant="h4" sx={{ color: "black" }}>
                There is no report post.
              </Typography>
            )}
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
