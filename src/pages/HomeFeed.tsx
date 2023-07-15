import * as React from "react";
import { styled } from "@mui/material/styles";
import MContainer from "../components/MContainer/MContainer";
import PostForm from "../components/MContainer/PostForm";
import Box from "@mui/material/Box/Box";

import { dbFireStore } from "../config/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Post } from "../interface/PostContent";
import { User } from "../interface/User";

interface IData {
  inFoUser: User[];
}

export default function HomeFeed({inFoUser} : IData) {
  const Item = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));

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
  }, [reFresh]);

  return (
    <>
      <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
        <PostForm handdleReFresh={handleRefresh} inFoUser={inFoUser} />
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
              likeNumber={m.likes.length}
              likes={m.likes}
              commentNumber={m.comments.length}
              handleRefresh={handleRefresh}
            />
          </Box>
        ))}
      </Item>
    </>
  );
}
