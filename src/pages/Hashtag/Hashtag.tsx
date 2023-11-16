
import { Box, Paper } from '@mui/material';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where
} from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dbFireStore } from '../../config/firebase';
import { EventPost } from '../../interface/Event';
import { Post } from '../../interface/PostContent';
import { Item } from '../../App';
import { User } from '../../interface/User';
import MContainer from '../../components/MContainer/MContainer';
import ShareEvent from '../../components/Events/ShareEvent';
import Loading from '../../components/Loading';

export default function Hashtag() {
    const { hashtag } = useParams();
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const [postData, setPostData] = useState<Post[]>([]);
    const [eventData, setEventData] = useState<EventPost[]>([]);
    const [openLoading, setOpenLoading] = useState(false);

    useEffect(() => {
        setOpenLoading(true);
        const queryData = query(
            collection(dbFireStore, "posts"),
            orderBy("createAt", "desc"),
            where("hashTagTopic", "==", hashtag)
        );
        const unsubscribe = onSnapshot(
            queryData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
                setPostData(queriedData);
            },
            (error) => {
                console.error("Error fetching data:", error);
            }
        );
        const queryEventData = query(
            collection(dbFireStore, "events"),
            orderBy("createAt", "desc"),
            where("topic", "==", hashtag)
        );
        const eventUnsubscribe = onSnapshot(
            queryEventData,
            (snapshot) => {
                const queriedEventData = snapshot.docs.map(
                    (doc) => doc.data() as EventPost
                );
                setEventData(queriedEventData);
                setOpenLoading(false);
            },
            (error) => {
                console.error("Error fetching data:", error);
            }
        );

        return () => {
            unsubscribe();
            eventUnsubscribe();
        };
    }, [hashtag]);

    useEffect(() => {
        const queryData = query(
            collection(dbFireStore, "users"),
            where("uid", "==", userInfo.uid)
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
    }, [userInfo.uid]);

    return (
        <>
            <Loading
                openLoading={openLoading}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ justifyContent: "center" }}>
                    <Paper sx={{ p: 2, fontSize: "20px", textAlign: "center", borderRadius: "10px", mb: 1 }}>
                        {hashtag?.startsWith("#")
                            ? hashtag
                            : `#${hashtag}`}
                    </Paper>

                    <Item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {postData
                            .filter(
                                (post) =>
                                    (post.status == "Public" ||
                                        (post.status == "Friend" &&
                                            inFoUser.some((user) =>
                                                user.friendList?.some(
                                                    (friend) => friend.friendId == post.owner
                                                )
                                            )) ||
                                        post.owner === userInfo.uid) && post.hashTagTopic == hashtag
                            )
                            .map((m) => (
                                <Box key={m.id}>
                                    {(m.status === "Public" || m.status === "Friend") && (
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
                                            groupName={m.groupName}
                                            groupId={m.groupId}
                                            shareUsers={m.shareUsers}
                                            userInfo={inFoUser}
                                            location={m.location}
                                        />
                                    )}
                                </Box>
                            ))}
                    </Item>

                    <Item
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {eventData.filter((event) => event.status !== "Private")
                            .map((m) => (
                                <Box key={m.eventId}>
                                    <ShareEvent
                                        eventId={m.eventId}
                                        startDate={m.startDate}
                                        startTime={m.startTime}
                                        title={m.title}
                                        endDate={m.endDate}
                                        endTime={m.endTime}
                                        userId={m.owner}
                                        coverPhoto={m.coverPhoto}
                                    />
                                </Box>
                            ))}
                    </Item>
                </Box>
            </Box>
        </>
    );
}
