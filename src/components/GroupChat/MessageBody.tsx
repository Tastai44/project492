import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Avatar,
    Chip,
    ImageList,
    ImageListItem,
    Typography,
} from "@mui/material";
import { Message } from "../../interface/Chat";
import { compareAsc } from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";

interface IData {
    messages: Message[];
    groupId: string;
    members: string[];
}

export default function MessageBody(props: IData) {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [chatMessages, setChatMessage] = useState<Message[]>([]);

    useMemo(() => {
        if (props.members.length !== 0) {
            const chatMessages = props.messages.filter((message) =>
                message.participants.some((participant) => participant === userInfo.uid)
            );
            setChatMessage(chatMessages);
        }
    }, [props.members.length, props.messages, userInfo.uid]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(dbFireStore, "users"),
                    where("uid", "in", props.members));
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
        if (props.members.length !== 0) {
            fetchData();
        }

    }, [props.members]);

    return (
        <div>
            {chatMessages.sort((a, b) =>
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
                                                src={
                                                    inFoUser.find((user) => user.uid === mess.senderId)
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
                                            {mess.senderId !== userInfo.uid && (
                                                <Typography sx={{ ml: 1 }} fontSize={12}>
                                                    {inFoUser
                                                        .filter((user) => user.uid === mess.senderId)
                                                        .map((user) => `${user.firstName} ${user.lastName}`)}
                                                </Typography>
                                            )}
                                            <Chip
                                                color="primary"
                                                label={chat.message}
                                                variant={
                                                    chat.senderId === userInfo.uid ? "filled" : "outlined"
                                                }
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {chat.emoji && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        {chat.senderId !== userInfo.uid && (
                                            <Avatar
                                                src={
                                                    inFoUser.find((user) => user.uid === mess.senderId)
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
                                            {mess.senderId !== userInfo.uid && (
                                                <Typography sx={{ ml: 1 }} fontSize={12}>
                                                    {inFoUser
                                                        .filter((user) => user.uid === mess.senderId)
                                                        .map((user) => `${user.firstName} ${user.lastName}`)}
                                                </Typography>
                                            )}
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
                                                    src={
                                                        inFoUser.find((user) => user.uid === mess.senderId)
                                                            ?.profilePhoto
                                                    }
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





// {mess.sender_id !== userInfo.uid && (
//     <Avatar
//         src={
//             inFoUser.find((user) => user.uid === mess.ownerContent_id)
//                 ?.profilePhoto
//         }
//         sx={{ width: "25px", height: "25px", mr: 1 }}
//     />
// )}