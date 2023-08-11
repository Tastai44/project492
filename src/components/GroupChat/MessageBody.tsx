import {
    Box,
    Avatar,
    Chip,
    ImageList,
    ImageListItem,
    Typography,
} from "@mui/material";
import { GroupMessage } from "../../interface/Chat";
import { compareAsc } from "date-fns";
import React from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";

interface IData {
    messages: GroupMessage[];
    groupId: string;
}

export default function MessageBody(props: IData) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = React.useState<User[]>([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(dbFireStore, "users"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const queriedData = querySnapshot.docs.map(
                        (doc) =>
                        ({
                            uid: doc.id,
                            ...doc.data(),
                        } as User)
                    );
                    setInFoUser(queriedData);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [props.messages]);

    return (
        <div>
            {props.messages
                .filter((item) => item.receiver_id === props.groupId)
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
                                        src={
                                            inFoUser.find((user) => user.uid === mess.ownerContent_id)
                                                ?.profilePhoto
                                        }
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
                                    {mess.sender_id !== userInfo.uid && (
                                        <Typography sx={{ ml: 1 }} fontSize={12}>
                                            {inFoUser
                                                .filter((user) => user.uid === mess.ownerContent_id)
                                                .map((user) => `${user.firstName} ${user.lastName}`)}
                                        </Typography>
                                    )}
                                    <Chip
                                        color="primary"
                                        label={mess.content}
                                        variant={
                                            mess.sender_id === userInfo.uid ? "filled" : "outlined"
                                        }
                                    />
                                </Box>
                            </Box>
                        )}

                        {mess.emoji && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                {mess.sender_id !== userInfo.uid && (
                                    <Avatar
                                        src={
                                            inFoUser
                                                .filter((item) => item.uid == mess.ownerContent_id)
                                                .find((user) => user.profilePhoto)?.profilePhoto
                                        }
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
                                    {mess.sender_id !== userInfo.uid && (
                                        <Typography sx={{ ml: 1 }} fontSize={12}>
                                            {inFoUser
                                                .filter((user) => user.uid === mess.ownerContent_id)
                                                .map((user) => `${user.firstName} ${user.lastName}`)}
                                        </Typography>
                                    )}
                                    <Chip
                                        color="primary"
                                        label={
                                            <Box>
                                                {String.fromCodePoint(parseInt(mess.emoji, 16))}
                                            </Box>
                                        }
                                        variant={
                                            mess.sender_id === userInfo.uid ? "filled" : "outlined"
                                        }
                                    />
                                </Box>
                            </Box>
                        )}

                        {mess.photoMessage.length !== 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Box sx={{ display: "flex", mb: -1.5 }}>
                                    {mess.sender_id !== userInfo.uid && (
                                        <Avatar
                                            src={
                                                inFoUser
                                                    .filter((item) => item.uid == mess.ownerContent_id)
                                                    .find((user) => user.profilePhoto)?.profilePhoto
                                            }
                                            sx={{ width: "25px", height: "25px", mr: 1 }}
                                        />
                                    )}
                                    {mess.sender_id !== userInfo.uid && (
                                        <Typography
                                            sx={{ ml: 1, color: "grey", mb: -2 }}
                                            fontSize={12}
                                        >
                                            {inFoUser
                                                .filter((user) => user.uid === mess.ownerContent_id)
                                                .map((user) => `${user.firstName} ${user.lastName}`)}
                                        </Typography>
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            mess.sender_id === userInfo.uid ? "end" : "start",
                                    }}
                                >
                                    <ImageList
                                        sx={{
                                            width: "50%",
                                            height: "auto",
                                        }}
                                        cols={1}
                                    >
                                        {mess.photoMessage.map((image, index) => (
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

                        {/* {mess.photoMessage.length !== 0 && (
              <>
                {mess.sender_id !== userInfo.uid && (
                  <Avatar
                    src={
                      inFoUser
                        .filter((item) => item.uid == mess.ownerContent_id)
                        .find((user) => user.profilePhoto)?.profilePhoto
                    }
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
                  {mess.sender_id !== userInfo.uid && (
                    <Typography sx={{ ml: 1, color: "grey" }} fontSize={12}>
                      {inFoUser
                        .filter((user) => user.uid === mess.ownerContent_id)
                        .map((user) => `${user.firstName} ${user.lastName}`)}
                    </Typography>
                  )}
                  <ImageList
                    sx={{
                      width: "50%",
                      height: "auto",
                    }}
                    cols={1}
                  >
                    {mess.photoMessage.map((image, index) => (
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
              </>
            )} */}
                    </Box>
                ))}
        </div>
    );
}
