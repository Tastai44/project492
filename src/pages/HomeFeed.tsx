import * as React from "react";
import MContainer from "../components/MContainer/MContainer";
import PostForm from "../components/MContainer/PostForm";
import Box from "@mui/material/Box";

import { dbFireStore } from "../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { Post } from "../interface/PostContent";
import { User } from "../interface/User";
import { Item } from "../App";

export default function HomeFeed() {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [reFresh, setReFresh] = React.useState(0);
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);

  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };
  const [postData, setPostData] = React.useState<Post[]>([]);
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

  React.useMemo(() => {
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
  }, [userInfo.uid]);

  return (
    <>
      <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
        <PostForm handdleReFresh={handleRefresh} inFoUser={inFoUser} />
      </Item>
      <Item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {postData
          .filter(
            (post) =>
              inFoUser.some((user) =>
                user.friendList?.some((friend) => friend.friendId == post.owner)
              ) || post.owner === userInfo.uid
          )
          .map((m) => (
            <Box key={m.id}>
              {(m.status === "Public" || m.status === "Friend") && (
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
                  groupName={m.groupName}
                  groupId={m.groupId}
                  handleRefresh={handleRefresh}
                />
              )}
            </Box>
          ))}
      </Item>
    </>
  );
}
