import * as React from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styleBoxChat } from "../../utils/styleBox";
import { StyledBadge } from "../RightSide/UserCard";

import CancelIcon from "@mui/icons-material/Cancel";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { User } from "../../interface/User";
import { Message } from "../../interface/Chat";
import { compareAsc } from "date-fns";

interface IFunction {
  handleClose: () => void;
}

interface IData {
  uId: string;
  openChat: boolean;
}

export default function ChatBox(props: IFunction & IData) {
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [message, setMessage] = React.useState("");
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const handleMessage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setMessage(value);
  };
  React.useMemo(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", props.uId)
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
  }, [props.uId]);

  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  React.useEffect(() => {
    const messagesCollectionRef = collection(dbFireStore, "messages");
    const unsubscribe = onSnapshot(messagesCollectionRef, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(
        (doc) => doc.data() as Message
      );
      setMessages(messagesData);
    });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    const messagesCollection = collection(dbFireStore, "messages");
    const newMessage = {
      conversation_id: "",
      sender_id: userInfo.uid,
      receiver_id: props.uId,
      content: message,
      timestamp: new Date().toISOString(),
    };
    try {
      const docRef = doc(messagesCollection);
      const conversationId = docRef.id;
      const updatedMessage = { ...newMessage, conversation_id: conversationId };
      await setDoc(docRef, updatedMessage)
        .then(() => {
          setMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Paper sx={styleBoxChat}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              height: "15%",
              display: "flex",
              justifyContent: "space-between",
              pl: 0.5,
            }}
          >
            {inFoUser.map((user) => (
              <ListItem key={user.uid}>
                <ListItemAvatar>
                  {user.isActive ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar
                        src={user.profilePhoto}
                        sx={{ width: "40px", height: "40px" }}
                      />
                    </StyledBadge>
                  ) : (
                    <Avatar
                      src={user.profilePhoto}
                      sx={{ width: "40px", height: "40px" }}
                    />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ fontSize: "16px", ml: -1 }}>
                      <b>{`${user.firstName} ${user.lastName}`} </b>
                    </Box>
                  }
                  secondary={
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontSize: "14px",
                        ml: -1,
                      }}
                    >
                      {user.isActive ? `Active` : "Inactive"}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            <Box sx={{ p: 0.2 }}>
              <IconButton size="small" onClick={props.handleClose}>
                <CancelIcon sx={{ color: "white", fontSize: "20px" }} />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "white",
              height: "70%",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
            ref={chatContainerRef}
          >
            {messages
              .filter(
                (item) =>
                  (item.receiver_id === userInfo.uid ||
                  item.sender_id === userInfo.uid) &&
                  (item.receiver_id === props.uId ||
                    item.sender_id === props.uId)
              )
              .sort((a, b) =>
                compareAsc(new Date(a.timestamp), new Date(b.timestamp))
              )
              .map((mess, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      mess.sender_id === userInfo.uid ? "end" : "start",
                    mt: 1,
                    ml: mess.sender_id === userInfo.uid ? 0 : 1,
                    mr: mess.sender_id === userInfo.uid ? 1 : 0,
                  }}
                >
                  <Chip
                    color="primary"
                    label={mess.content}
                    variant={
                      mess.sender_id === userInfo.uid ? "filled" : "outlined"
                    }
                  />
                </Box>
              ))}
          </Box>

          <Box
            sx={{
              height: "15%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Box>
              <IconButton>
                <CameraAltOutlinedIcon
                  sx={{ color: "primary.main", fontSize: "16px" }}
                />
              </IconButton>
              <IconButton>
                <EmojiEmotionsIcon
                  sx={{ color: "primary.main", fontSize: "16px" }}
                />
              </IconButton>
            </Box>
            <Box>
              <TextField
                size="small"
                name="caption"
                variant="outlined"
                multiline
                maxRows={1}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "primary.contrastText",
                  overflow: "auto",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                }}
                value={message}
                onChange={handleMessage}
              />
            </Box>
            <Box>
              <IconButton onClick={handleSendMessage}>
                <SendOutlinedIcon
                  sx={{ color: "primary.main", fontSize: "16px" }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
