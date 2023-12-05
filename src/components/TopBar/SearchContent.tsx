import { useState, ChangeEvent, useEffect } from "react";
import { Box, Divider, IconButton, Modal, Paper, Typography } from "@mui/material";
import SearchBar from "../../helper/SearchBar";
import { styleBoxPop, styleSearchBox } from "../../utils/styleBox";
import CancelIcon from "@mui/icons-material/Cancel";
import { Like, Post } from "../../interface/PostContent";
import { collection, orderBy, onSnapshot, query } from "firebase/firestore";
import { dbFireStore, storage } from "../../config/firebase";
import EachTopic from "../Topics/EachTopic";
import { User } from "../../interface/User";
import Content from "../MContainer/Content";
import { IGroup } from "../../interface/Group";
import { NavLink } from "react-router-dom";
import EachGroup from "../Groups/EachGroup";
import { StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";

interface IData {
    openSearchBar: boolean;
    inFoUser: User[];
    handleCloseSearchBar: () => void;
}
export default function SearchContent(props: IData) {
    const [searchValue, setValue] = useState("");
    const [dataPost, setPosts] = useState<Post[]>([]);
    const [groupData, setGroupData] = useState<IGroup[]>([]);
    const [openPost, setOpenPost] = useState(false);
    const [postId, setPostId] = useState("");
    const [likes, setLikes] = useState<Like[]>([]);
    const [postOwner, setPostOwner] = useState("");
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [refreshImage, setRefreshImage] = useState(0);

    useEffect(() => {
        const fetchData = query(
            collection(dbFireStore, "posts"),
            orderBy("createAt", "desc")
        );
        const unsubscribe = onSnapshot(
            fetchData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as Post);
                setPosts(queriedData);
            },
            (error) => {
                console.error("Error fetching data", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchData = query(
            collection(dbFireStore, "groups"),
            orderBy("createAt", "desc")
        );
        const unsubscribe = onSnapshot(
            fetchData,
            (snapshot) => {
                const queriedData = snapshot.docs.map((doc) => doc.data() as IGroup);
                setGroupData(queriedData);
            },
            (error) => {
                console.error("Error fetching data", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);

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
    }, [refreshImage]);

    const handletOpenPost = (id: string, likeData: Like[], owner: string) => {
        setOpenPost(true);
        setPostId(id);
        setLikes(likeData);
        setPostOwner(owner);
    };
    const handleClosePost = () => {
        setOpenPost(false);
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };
    return (
        <Box>
            <Modal
                open={openPost}
                onClose={handleClosePost}
            >
                <Box>
                    <Paper sx={styleBoxPop}>
                        <Content
                            postId={postId}
                            userId={userInfo.uid}
                            likes={likes}
                            owner={postOwner}
                            handleClosePost={handleClosePost}
                            imageUrls={imageUrls}
                            handleRefreshImage={() => setRefreshImage(pre => pre + 1)}
                        />
                    </Paper>
                </Box>
            </Modal>
            <Modal
                open={props.openSearchBar}
                onClose={props.handleCloseSearchBar}
            >
                <Box sx={styleSearchBox}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                        <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>Search for the content</Typography>
                        <IconButton onClick={props.handleCloseSearchBar}>
                            <CancelIcon />
                        </IconButton>
                    </Box>

                    <SearchBar
                        searchValue={searchValue}
                        handleSearch={handleSearch}
                        backgroupColor={'#F1F1F1'}
                    />

                    <Divider style={{ background: "#EAEAEA", marginBottom: 10 }} />
                    {searchValue !== "" && (
                        <>
                            {props.inFoUser.length > 0 && (
                                dataPost
                                    .filter((search) => search.caption.includes(searchValue) || search.hashTagTopic.includes(searchValue))
                                    .filter((item) =>
                                        item.owner === userInfo.uid ||
                                        item.status === "Public" ||
                                        (item.status == "Friend" &&
                                            props.inFoUser.some(
                                                (user) =>
                                                    user.uid === item.owner ||
                                                    user.friendList?.some(
                                                        (friend) => friend.friendId == item.owner
                                                    )
                                            ))
                                    )
                                    .map((posts) => (
                                        <Box
                                            key={posts.id}
                                            onClick={() => handletOpenPost(posts.id, posts.likes, posts.owner)}
                                        >
                                            <EachTopic hashTag={posts.hashTagTopic} />
                                        </Box>
                                    ))
                            )}
                            {groupData
                                .filter(
                                    (item) =>
                                        (item.status === "Public" && item.groupName.includes(searchValue)) ||
                                        (item.hostId === userInfo.uid) ||
                                        (item.members.some((member) => member === userInfo.uid && item.groupName.includes(searchValue)))
                                )
                                .map((g) => (
                                    <NavLink key={g.gId} to={`/groupDetail/${g.gId}`}>
                                        <EachGroup title={g.groupName} />
                                    </NavLink>
                                ))}
                        </>
                    )}



                </Box>
            </Modal>
        </Box>
    );
}
