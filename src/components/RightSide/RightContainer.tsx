import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Button, Divider, Modal, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import UserCard from "./UserCard";
import "firebase/database";
import { collection, query, getDocs, where } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";
import { IGroup } from "../../interface/Group";
import ChatBox from "../Chat/ChatBox";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function RightContainer() {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  const [userId, setUserId] = React.useState("");
  const [groupData, setGroupData] = React.useState<IGroup[]>([]);
  const [openChat, setOpenChat] = React.useState(false);
  const handleOpenChat = (id: string) => {
    setOpenChat(true);
    setUserId(id);
  };
  const handleCloseChat = () => setOpenChat(false);

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
    const fetchGroupData = async () => {
      try {
        const q = query(collection(dbFireStore, "groups"));
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) => doc.data() as IGroup
        );
        setGroupData(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGroupData();
    fetchData();
  }, [userInfo.uid]);

  return (
    <Box sx={{ width: "100%" }}>
      <Modal
        open={openChat}
        onClose={handleCloseChat}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <ChatBox openChat={openChat} uId={userId} handleClose={handleCloseChat} />
        </Box>
      </Modal>
      <Stack spacing={2}>
        <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              fontSize: "18px",
              fontWeight: "bold",
              padding: 10,
            }}
          >
            Friend
          </div>
          <div>
            <TextField
              id="outlined-size-small"
              size="small"
              sx={{ m: 1, width: "25vh" }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              placeholder="Search for friend"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button sx={{ color: "black" }}>Active</Button>
            <Button sx={{ color: "black" }}>General</Button>
          </div>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
          <Box>
            {inFoUser.some((user) => user.friendList.length !== 0) ? (
              <Box>
                {inFoUser.map((user) =>
                  user.friendList.map((friend) => (
                    <Box
                      onClick={() => handleOpenChat(friend.friendId)}
                      sx={{ cursor: "pointer" }}
                      key={friend.friendId}
                    >
                      <UserCard
                        userId={friend.friendId}
                      />
                    </Box>
                  ))
                )}
              </Box>
            ) : (
              <Typography>You have no friend</Typography>
            )}
          </Box>
        </Item>

        <Item style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              fontSize: "18px",
              fontWeight: "bold",
              padding: 10,
            }}
          >
            Groups
          </div>
          <div>
            <TextField
              id="outlined-size-small"
              size="small"
              sx={{ m: 1, width: "25vh" }}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              placeholder="Search for friend"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button sx={{ color: "black" }}>Active</Button>
            <Button sx={{ color: "black" }}>General</Button>
          </div>
          <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
          <Box>
            {groupData.some((group) =>
              group.members.some((member) => member.uid == userInfo.uid)
            ) ? (
              <Box>
                {groupData
                  .filter((item) =>
                    item.members.some((member) => member.uid == userInfo.uid)
                  )
                  .map((group) => (
                    <Box
                      onClick={() => handleOpenChat(group.gId)}
                      sx={{ cursor: "pointer" }}
                      key={group.gId}
                    >
                      <UserCard
                        username={group.groupName}
                        profilePhoto={group.coverPhoto}
                      />
                    </Box>
                  ))}
              </Box>
            ) : (
              <Typography>You have no group</Typography>
            )}
          </Box>
        </Item>
      </Stack>
    </Box>
  );
}
