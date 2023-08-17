import {
  Box,
  Avatar,
  Chip,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { Message } from "../../interface/Chat";
import { compareAsc } from "date-fns";

interface IData {
  messages: Message[];
  uId: string;
  userProfile?: string;
}

export default function MessageBody(props: IData) {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <div>
      {props.messages.sort((a, b) =>
        compareAsc(new Date(a.timestamp), new Date(b.timestamp))
      )
        .map((mess, index) => (
          <Box
            key={index}
          >
            {mess.content.map((chat, index) => (
              <Box key={index}
                sx={{
                  display: "flex",
                  justifyContent: chat.senderId === userInfo.uid ? "end" : "start",
                  mt: 1,
                  ml: chat.senderId === userInfo.uid ? 0 : 1,
                  mr: chat.senderId === userInfo.uid ? 1 : 0,
                }}
              >
                {chat.message && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {chat.senderId !== userInfo.uid && (
                      <Avatar
                        src={props.userProfile}
                        sx={{ width: "25px", height: "25px", mr: 1 }}
                      />
                    )}

                    <Chip
                      color="primary"
                      label={chat.message}
                      variant={
                        chat.senderId === userInfo.uid ? "filled" : "outlined"
                      }
                    />
                  </Box>
                )}

                {chat.emoji && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {chat.senderId !== userInfo.uid && (
                      <Avatar
                        src={props.userProfile}
                        sx={{ width: "25px", height: "25px", mr: 1 }}
                      />
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        color: "grey",
                      }}
                    >
                      <Chip
                        color="primary"
                        label={
                          <Box>
                            {String.fromCodePoint(parseInt(chat.emoji, 16))}
                          </Box>
                        }
                        variant={
                          chat.senderId === userInfo.uid ? "filled" : "outlined"
                        }
                      />
                    </Box>
                  </Box>
                )}

                {chat.photoMessage.length !== 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      color: "grey",
                    }}
                  >
                    <Box sx={{ display: "flex", mb: -1.5 }}>
                      {chat.senderId !== userInfo.uid && (
                        <Avatar
                          src={props.userProfile}
                          sx={{ width: "25px", height: "25px", mr: 1 }}
                        />
                      )}
                    </Box>
                    <Box
                      sx={{
                        color: "black",
                        display: "flex",
                        justifyContent:
                          chat.senderId === userInfo.uid ? "end" : "start",
                      }}
                    >
                      <ImageList
                        sx={{
                          width: "50%",
                          height: "auto",
                        }}
                        cols={1}
                      >
                        {chat.photoMessage.map((image, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={image}
                              alt={`Preview ${index}`}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}

          </Box>
        ))}
    </div>
  );
}
