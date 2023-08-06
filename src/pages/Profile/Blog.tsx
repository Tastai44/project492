import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import MContainer from "../../components/MContainer/MContainer";
import PostForm from "../../components/MContainer/PostForm";
import { useParams } from "react-router-dom";

import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { Post } from "../../interface/PostContent";
import { User } from "../../interface/User";
import { Item } from "../../App";
import ShareContent from "./ShareContent";
import { EventPost } from "../../interface/Event";
import ShareEvent from "../../components/Events/ShareEvent";

interface IData {
  reFreshInfo: number;
}

export default function Blog({ reFreshInfo }: IData) {
  const { userId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  const [reFresh, setReFresh] = React.useState(0);
  const [type, setType] = React.useState("General");

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };
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
  }, [reFresh, userId, reFreshInfo]);

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

  const [eventData, setEventData] = React.useState<EventPost[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "events"),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) => doc.data() as EventPost
        );
        setEventData(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reFresh]);

  console.log(
    data.some((post) => post.shareUsers),
    eventData.some((event) => event.shareUsers)
  );

  return (
    <div>
      {inFoUser.map((m) => (
        <Box sx={{ flexGrow: 1 }} key={m.uid}>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                <PostForm handdleReFresh={handleRefresh} inFoUser={inFoUser} />
              </Item>
              {type === "General" ? (
                <Item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {data
                    .filter((f) => f.owner === userId)
                    .map((m) => (
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
                          reFreshInfo={reFreshInfo}
                          shareUsers={m.shareUsers}
                          userInfo={inFoUser}
                        />
                      </Box>
                    ))}
                </Item>
              ) : (
                <>
                  {data.some((f) =>
                    f.shareUsers.some(
                      (share) =>
                        share.shareBy == userId &&
                        (share.status == "Private" || share.status == "Public")
                    )
                  ) ? (
                    <Item
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {data
                        .filter((f) =>
                          f.shareUsers.some(
                            (share) =>
                              share.shareBy == userId &&
                              (share.status == "Private" ||
                                share.status == "Public")
                          )
                        )
                        .map((m) => (
                          <Box key={m.id}>
                            <ShareContent
                              userId={userId}
                              postId={m.id}
                              handleRefresh={handleRefresh}
                              reFreshInfo={reFreshInfo}
                              shareUsers={m.shareUsers.filter(
                                (share) =>
                                  share.status == "Private" ||
                                  (share.status == "Public" &&
                                    share.shareBy == userId)
                              )}
                            />
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
                              reFreshInfo={reFreshInfo}
                              shareUsers={m.shareUsers}
                              userInfo={inFoUser}
                              groupName={m.groupName}
                              groupId={m.groupId}
                            />
                          </Box>
                        ))}
                    </Item>
                  ) : data.some((f) =>
                      f.shareUsers.some(
                        (share) =>
                          share.shareTo == userId && share.status == "Friend"
                      )
                    ) ? (
                    <Item
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {data
                        .filter((f) =>
                          f.shareUsers.some(
                            (share) =>
                              share.shareTo == userId &&
                              share.status == "Friend"
                          )
                        )
                        .map((m) => (
                          <Box key={m.id}>
                            <ShareContent
                              userId={userId}
                              postId={m.id}
                              handleRefresh={handleRefresh}
                              reFreshInfo={reFreshInfo}
                              shareUsers={m.shareUsers.filter(
                                (share) =>
                                  share.status == "Friend" &&
                                  share.shareTo == userId
                              )}
                            />
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
                              reFreshInfo={reFreshInfo}
                              shareUsers={m.shareUsers}
                              userInfo={inFoUser}
                              groupName={m.groupName}
                              groupId={m.groupId}
                            />
                          </Box>
                        ))}
                    </Item>
                  ) : (
                    <Typography>This no post share data to show!</Typography>
                  )}

                  {eventData.some((f) =>
                    f.shareUsers.some(
                      (share) =>
                        share.shareBy == userId &&
                        (share.status == "Private" || share.status == "Public")
                    )
                  ) ? (
                    <Item
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {eventData
                        .filter((f) =>
                          f.shareUsers.some(
                            (share) =>
                              share.shareBy == userId &&
                              (share.status == "Private" ||
                                share.status == "Public")
                          )
                        )
                        .map((m) => (
                          <Box key={m.id}>
                            <ShareContent
                              userId={userId}
                              eventId={m.id}
                              handleRefresh={handleRefresh}
                              reFreshInfo={reFreshInfo}
                              shareUsers={m.shareUsers.filter(
                                (share) =>
                                  share.status == "Private" ||
                                  (share.status == "Public" &&
                                    share.shareBy == userId)
                              )}
                            />
                            <ShareEvent
                              eventId={m.id}
                              startDate={m.startDate}
                              startTime={m.startTime}
                              title={m.title}
                              endDate={m.endDate}
                              endTime={m.endTime}
                              userId={m.owner}
                              coverPhoto={m.coverPhoto}
                              handleRefresh={handleRefresh}
                            />
                          </Box>
                        ))}
                    </Item>
                  ) : eventData.some((f) =>
                      f.shareUsers.some(
                        (share) =>
                          share.shareTo == userId && share.status == "Friend"
                      )
                    ) ? (
                    <Item
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {eventData
                        .filter((f) =>
                          f.shareUsers.some(
                            (share) =>
                              share.shareTo == userId &&
                              share.status == "Friend"
                          )
                        )
                        .map((m) => (
                          <Box key={m.id}>
                            <ShareContent
                              userId={userId}
                              eventId={m.id}
                              handleRefresh={handleRefresh}
                              reFreshInfo={reFreshInfo}
                              shareUsers={m.shareUsers.filter(
                                (share) =>
                                  share.status == "Friend" &&
                                  share.shareTo == userId
                              )}
                            />
                            <ShareEvent
                              eventId={m.id}
                              startDate={m.startDate}
                              startTime={m.startTime}
                              title={m.title}
                              endDate={m.endDate}
                              endTime={m.endTime}
                              userId={m.owner}
                              coverPhoto={m.coverPhoto}
                              handleRefresh={handleRefresh}
                            />
                          </Box>
                        ))}
                    </Item>
                  ) : (
                    <Typography>This no event share data to show!</Typography>
                  )}
                </>
              )}
            </Grid>

            <Grid item xs={3}>
              <Item>
                <FormControl fullWidth sx={{ mb: 1, backgroundColor: "white" }}>
                  <InputLabel id="demo-simple-select-label">
                    Content type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Content type"
                    onChange={handleChangeType}
                  >
                    <MenuItem value={"General"}>General</MenuItem>
                    <MenuItem value={"Share"}>Share</MenuItem>
                  </Select>
                </FormControl>
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
