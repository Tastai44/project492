import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

import CoverPhoto from "../../components/Groups/CoverPhoto";
import LeftSideContainer from "../../components/Groups/LeftSideContainer";
import MContainer from "../../components/MContainer/MContainer";
import AboutGroup from "../../components/Groups/AboutGroup";
import { useParams } from "react-router-dom";
import { Item } from "../../App";

import { dbFireStore } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where, onSnapshot } from "firebase/firestore";
import { IGroup } from "../../interface/Group";
import { User } from "../../interface/User";
import PostGroupForm from "../../components/Groups/PostGroupForm";
import { Post } from "../../interface/PostContent";

export default function GroupDetails() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = React.useState<User[]>([]);
    const { groupId } = useParams();
    const [groupData, setGroupData] = React.useState<IGroup[]>([]);

    React.useEffect(() => {
        const queryGroupData = query(
            collection(dbFireStore, "groups"),
            where("gId", "==", groupId),
            orderBy("createAt", "desc")
        );
        const unsubscribe = onSnapshot(
            queryGroupData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as IGroup);
                setGroupData(queriedData);
            },
            (error) => {
                console.error("Error fetching data:", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [groupId]);

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
    }, [userInfo.uid]);

    const [postData, setPostData] = React.useState<Post[]>([]);
    React.useEffect(() => {
        const queryPostData = query(
            collection(dbFireStore, "posts"),
            where("groupId", "==", groupId),
            orderBy("createAt", "desc")
        );
        const unsubscribe = onSnapshot(
            queryPostData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
                setPostData(queriedData);
            },
            (error) => {
                console.error("Error fetching data:", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [groupId]);

    return (
        <div>
            {groupData.map((g) => (
                <Grid key={g.gId} sx={{ flexGrow: 1 }} container marginTop={5}>
                    <Grid
                        container
                        justifyContent="space-between"
                        paddingLeft={5}
                        paddingRight={5}
                        spacing={10}
                    >
                        <Grid item xs={12}>
                            <Item>
                                <Box sx={{ width: "100%" }}>
                                    <Stack>
                                        <Item sx={{ mb: 0 }}>
                                            <CoverPhoto
                                                gId={g.gId}
                                                host={g.hostId}
                                                coverPhoto={g.coverPhoto}
                                                createAt={g.createAt}
                                                title={g.groupName}
                                                members={g.members}
                                                details={g.details}
                                                status={g.status}
                                            />
                                        </Item>
                                        <Item>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={2.5}>
                                                        <Item>
                                                            <LeftSideContainer
                                                                hostId={g.hostId}
                                                                members={g.members}
                                                                gId={g.gId}
                                                            />
                                                        </Item>
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                                                            <PostGroupForm
                                                                inFoUser={inFoUser}
                                                                groupName={g.groupName}
                                                                groupId={g.gId}
                                                            />
                                                        </Item>
                                                        <Item>
                                                            {postData.map((m) => (
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
                                                                        groupName={m.groupName}
                                                                        groupId={m.groupId}
                                                                        shareUsers={m.shareUsers}
                                                                        userInfo={inFoUser}
                                                                        location={m.location}
                                                                    />
                                                                </Box>
                                                            ))}
                                                        </Item>
                                                    </Grid>
                                                    <Grid item xs={2.5}>
                                                        <Item>
                                                            <AboutGroup details={g.details} />
                                                        </Item>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Item>
                                    </Stack>
                                </Box>
                            </Item>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
}
