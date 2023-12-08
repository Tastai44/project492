import { Fragment, useEffect, useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Modal } from '@mui/material';

import { collection, where, onSnapshot, query, updateDoc, doc } from 'firebase/firestore';
import { dbFireStore } from '../../config/firebase';
import { User } from '../../interface/User';
import ChatBox from '../Chat/ChatBox';

interface IData {
    message: string;
    dateCreated: string;
    senderId: string;
    notiId: string;
    imageUrls: string[];
    isRead: boolean;
}

export default function NotiCard(props: IData) {
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [openChat, setOpenChat] = useState(false);
    const [senderId, setSenderId] = useState("");

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", props.senderId)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as User);
                setInFoUser(queriedData);
            },
            (error) => {
                console.error("Error fetching data: ", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [props.senderId]);

    const handleReaded = async () => {
        const messageNotification = collection(dbFireStore, "messageNotifications");
        try {
            const notiDocRef = doc(messageNotification, props.notiId);
            await updateDoc(notiDocRef, {
                isRead: true
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenChat = (senderId: string) => {
        setSenderId(senderId);
        handleReaded();
        setOpenChat(true);
    };
    const handleCloseChat = () => setOpenChat(false);

    return (
        <>
            <Modal
                open={openChat}
                onClose={handleCloseChat}
            >
                <Box>
                    <ChatBox uId={senderId} handleClose={handleCloseChat} />
                </Box>
            </Modal>
            <ListItem
                onClick={() => handleOpenChat(props.senderId)}
                alignItems="flex-start"
                sx={{
                    cursor: "pointer",
                    backgroundColor: props.isRead ? "" : "#e0e0e0",
                    "&:hover": {
                        backgroundColor: "primary.contrastText",
                    },
                }}
            >
                <ListItemAvatar>
                    <Avatar
                        alt="profile"
                        src={props.imageUrls.find((item) => item.includes(inFoUser.find((user) => user.profilePhoto)?.profilePhoto ?? ""))}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography
                            sx={{
                                display: "inline",
                            }}
                            fontSize={16}
                            component="span"
                            variant="body2"
                            color="black"
                            fontWeight="bold"
                        >
                            {`${inFoUser.find((user) => user.firstName)?.firstName} ${inFoUser.find((user) => user.lastName)?.lastName
                                }`}
                        </Typography>
                    }
                    secondary={
                        <Fragment>
                            <Typography
                                sx={{ display: "inline", fontSize: "16px" }}
                                component="span"
                                variant="body2"
                                color="black"
                            >
                                <b> Message</b>: {props.message}
                            </Typography>
                            <br />
                            {props.dateCreated}
                        </Fragment>
                    }
                />
            </ListItem>
        </>
    );
}
