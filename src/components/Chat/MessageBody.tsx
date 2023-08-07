import { Box, Avatar, Chip, ImageList, ImageListItem } from "@mui/material";
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
      {props.messages
        .filter(
          (item) =>
            (item.receiver_id === userInfo.uid ||
              item.sender_id === userInfo.uid) &&
            (item.receiver_id === props.uId || item.sender_id === props.uId)
        )
        .sort((a, b) =>
          compareAsc(new Date(a.timestamp), new Date(b.timestamp))
        )
        .map((mess, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: mess.sender_id === userInfo.uid ? "end" : "start",
              mt: 1,
              ml: mess.sender_id === userInfo.uid ? 0 : 1,
              mr: mess.sender_id === userInfo.uid ? 1 : 0,
            }}
          >
            {mess.content && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {mess.sender_id !== userInfo.uid && (
                  <Avatar
                    src={props.userProfile}
                    sx={{ width: "25px", height: "25px", mr: 1 }}
                  />
                )}

                <Chip
                  color="primary"
                  label={mess.content}
                  variant={
                    mess.sender_id === userInfo.uid ? "filled" : "outlined"
                  }
                />
              </Box>
            )}

            {mess.emoji && (
              <Chip
                color="primary"
                label={
                  <Box>{String.fromCodePoint(parseInt(mess.emoji, 16))}</Box>
                }
                variant={
                  mess.sender_id === userInfo.uid ? "filled" : "outlined"
                }
              />
            )}

            {mess.photoMessage.length !== 0 && (
              <ImageList
                sx={{
                  width: "50%",
                  height: "auto",
                }}
                cols={1}
              >
                {mess.photoMessage.map((image, index) => (
                  <ImageListItem key={index}>
                    <img src={image} alt={`Preview ${index}`} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>
        ))}
    </div>
  );
}
