import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Box, Grid } from "@mui/material";
import CoverPhoto from "../../components/Groups/CoverPhoto";
import LeftSideContainer from "../../components/Groups/LeftSideContainer";
import MContainer from "../../components/MContainer/MContainer";
import AboutGroup from "../../components/Groups/AboutGroup";
import { useParams } from "react-router-dom";
import { Item } from "../../App";
import { dbFireStore, storage } from "../../config/firebase";
import { collection, query, orderBy, getDocs, where, onSnapshot } from "firebase/firestore";
import { IGroup } from "../../interface/Group";
import { User } from "../../interface/User";
import PostGroupForm from "../../components/Groups/PostGroupForm";
import { Post } from "../../interface/PostContent";
import Content from "../../components/Report/Content";
import ShareContent from "../Profile/ShareContent";
import { themeApp } from "../../utils/Theme";
import { StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";

export default function GroupDetails() {
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [inFoUser, setInFoUser] = useState<User[]>([]);
    const { groupId } = useParams();
    const [groupData, setGroupData] = useState<IGroup[]>([]);
    const [type, setType] = useState("General");
    const [postData, setPostData] = useState<Post[]>([]);
    const [shareGroupPost, setShareGroupPost] = useState<Post[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [reFreshImage, setReFreshImage] = useState(0);

    useEffect(() => {
        const queryGroupData = query(
            collection(dbFireStore, "groups"),
            where("gId", "==", groupId),
            orderBy("dateCreated", "desc")
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

    useEffect(() => {
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

    useEffect(() => {
        const queryPostData = query(
            collection(dbFireStore, "posts"),
            where("groupId", "==", groupId),
            orderBy("dateCreated", "desc")
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

    useEffect(() => {
        const queryPostData = query(
            collection(dbFireStore, "posts"),
            where("participants", "array-contains", groupId),
            orderBy("dateCreated", "desc")
        );
        const unsubscribe = onSnapshot(
            queryPostData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
                setShareGroupPost(queriedData);
            },
            (error) => {
                console.error("Error fetching data:", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [groupId]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const listRef: StorageReference = ref(storage, '/Images');
                const res = await listAll(listRef);
                const urls = await Promise.all(
                    res.items.map(async (itemRef) => {
                        const imageUrl = await getDownloadURL(itemRef);
                        return imageUrl;
                    })
                );
                setImageUrls(urls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchImages();
    }, [reFreshImage]);

    const handleChangeType = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    const isHost = groupData.some((group) => group.hostId == userInfo.uid);

    return (
        <div>
            {groupData.map((g) => (
                <Grid key={g.gId} sx={{ flexGrow: 1 }} container marginTop={5}>
                    <Grid
                        container
                        justifyContent="space-between"
                        sx={{
                            pl: 5, pr: 5,
                            [themeApp.breakpoints.down("lg")]: {
                                pl: 0, pr: 0
                            }
                        }}
                    >
                        <Grid item xs={12}>
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
                                            imageUrls={imageUrls}
                                            handleReFreshImage={() => setReFreshImage(pre => pre + 1)}
                                        />
                                    </Item>
                                    <Item sx={{
                                        [themeApp.breakpoints.down("md")]: {
                                            mt: "-20px"
                                        }
                                    }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={2.5}>
                                                    <Item>
                                                        <LeftSideContainer
                                                            hostId={g.hostId}
                                                            members={g.members}
                                                            gId={g.gId}
                                                            imageUrls={imageUrls}
                                                        />
                                                    </Item>
                                                </Grid>
                                                <Grid item xs={12} md={7}>
                                                    <Item sx={{ display: { xs: "block", md: "none" } }}>
                                                        <FormControl fullWidth sx={{ backgroundColor: "white", borderRadius: "10px" }}>
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
                                                                {g.hostId == userInfo.uid && (
                                                                    <MenuItem value={"Report"}>Report</MenuItem>
                                                                )}

                                                            </Select>
                                                        </FormControl>
                                                    </Item>
                                                    <Item sx={{ backgroundColor: "#fff", margin: 1, borderRadius: "10px" }}>
                                                        <PostGroupForm
                                                            inFoUser={inFoUser}
                                                            groupName={g.groupName}
                                                            groupId={g.gId}
                                                            groupStatus={g.status}
                                                            imageUrls={imageUrls}
                                                        />
                                                    </Item>

                                                    <Item>
                                                        {
                                                            type == "General" ? (
                                                                postData.map((m) => (
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
                                                                ))
                                                            ) : type == "Share" ? (
                                                                shareGroupPost.filter((f) =>
                                                                    f.shareUsers.some(
                                                                        (share) =>
                                                                            share.shareTo == g.gId &&
                                                                            share.status == "Group"
                                                                    )
                                                                )
                                                                    .map((m) => (
                                                                        <Box key={m.id}>
                                                                            <ShareContent
                                                                                userId={g.gId}
                                                                                postId={m.id}
                                                                                shareUsers={m.shareUsers.filter(
                                                                                    (share) =>
                                                                                    (share.status == "Group" &&
                                                                                        share.shareBy == m.shareUsers.find((share) => share.shareBy)?.shareBy)
                                                                                )}
                                                                                imageUrls={imageUrls}
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
                                                                                groupName={m.groupName}
                                                                                groupId={m.groupId}
                                                                                shareUsers={m.shareUsers}
                                                                                userInfo={inFoUser}
                                                                                location={m.location}
                                                                            />
                                                                        </Box>
                                                                    ))
                                                            ) : (
                                                                postData
                                                                    .filter((item) => item.reportPost.length !== 0 && item.status == "Private" && isHost)
                                                                    .map((post) => (
                                                                        <Content
                                                                            key={post.id}
                                                                            owner={post.owner}
                                                                            postId={post.id}
                                                                            caption={post.caption}
                                                                            hashTagTopic={post.hashTagTopic}
                                                                            status={post.status}
                                                                            createAt={post.createAt}
                                                                            emoji={post.emoji}
                                                                            photoPost={post.photoPost}
                                                                            groupName={post.groupName}
                                                                            groupId={post.groupId}
                                                                            reportNumber={post.reportPost.length}
                                                                            reFreshInfo={0}
                                                                            reportPost={post.reportPost}
                                                                            imageUrls={imageUrls}
                                                                        />
                                                                    ))
                                                            )

                                                        }
                                                    </Item>
                                                </Grid>
                                                <Grid item xs={2.5}>
                                                    <Item sx={{ display: { xs: "none", md: "block" } }}>
                                                        <FormControl fullWidth sx={{ mb: 1, backgroundColor: "white", borderRadius: "10px" }}>
                                                            <InputLabel id="demo-simple-select-label">
                                                                Content type
                                                            </InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={type}
                                                                label="Content type"
                                                                onChange={handleChangeType}
                                                                sx={{ borderRadius: "10px" }}
                                                            >
                                                                <MenuItem value={"General"}>General</MenuItem>
                                                                <MenuItem value={"Share"}>Share</MenuItem>
                                                                {g.hostId == userInfo.uid && (
                                                                    <MenuItem value={"Report"}>Report</MenuItem>
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                        <AboutGroup details={g.details} />
                                                    </Item>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Item>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            ))
            }
        </div >
    );
}
