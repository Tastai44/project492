import { useState, ChangeEvent, useEffect } from "react";
import { Box, Divider, IconButton, Modal, Typography } from "@mui/material";
import SearchBar from "../../helper/SearchBar";
import { styleSearchBox } from "../../utils/styleBox";
import CancelIcon from "@mui/icons-material/Cancel";
import { Post } from "../../interface/PostContent";
import { collection, orderBy, onSnapshot, query } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import EachTopic from "../Topics/EachTopic";
import { User } from "../../interface/User";
import { IGroup } from "../../interface/Group";
import { NavLink } from "react-router-dom";
import EachGroup from "../Groups/EachGroup";
import { themeApp } from "../../utils/Theme";

interface IData {
    openSearchBar: boolean;
    inFoUser: User[];
    handleCloseSearchBar: () => void;
}
export default function SearchContent(props: IData) {
    const [searchValue, setValue] = useState("");
    const [dataPost, setPosts] = useState<Post[]>([]);
    const [groupData, setGroupData] = useState<IGroup[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");

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

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };
    return (
        <Box>
            <Modal
                open={props.openSearchBar}
                onClose={props.handleCloseSearchBar}
            >
                <Box sx={styleSearchBox}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <Typography sx={{
                            fontSize: "25px", fontWeight: "bold", [themeApp.breakpoints.down("lg")]: {
                                fontSize: "18px"
                            }
                        }}>Search for the content only</Typography>
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
                        <Box sx={{ overflow: "auto", height: "200px" }}>
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
                                            onClick={props.handleCloseSearchBar}
                                        >
                                            <NavLink to={`/hashtag/${posts.hashTagTopic}`}>
                                                <EachTopic hashTag={posts.hashTagTopic} />
                                            </NavLink>
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
                                    <Box
                                        key={g.gId}
                                        onClick={props.handleCloseSearchBar}
                                    >
                                        <NavLink to={`/groupDetail/${g.gId}`}>
                                            <EachGroup title={g.groupName} />
                                        </NavLink>
                                    </Box>

                                ))}
                        </Box>
                    )}



                </Box>
            </Modal>
        </Box>
    );
}
