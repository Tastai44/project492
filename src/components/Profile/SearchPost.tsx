import { Grid, ImageList, ImageListItem, Typography } from "@mui/material";
import { Like, Post } from "../../interface/PostContent";

interface IData {
    searchValue: string;
    postData: Post[];
    handletOpenPost: (id: string, likes: Like[], owner: string) => void;
}

export default function SearchPost(props: IData) {
    return (
        <div>
            {props.postData.length !== 0 ? (
                <Grid sx={{ flexGrow: 1, gap: 1 }} container>
                    <ImageList
                        sx={{
                            width: "100%",
                            m: 1,
                            cursor: "pointer"
                        }}
                        cols={4}
                    >
                        {props.postData.filter((post) => post.hashTagTopic.includes(props.searchValue)).map((m) =>
                            m.photoPost.map((img, index) => (
                                <ImageListItem
                                    key={index}
                                    onClick={() => props.handletOpenPost(m.id, m.likes, m.owner)}
                                >
                                    <img src={img} alt={`Preview ${index}`} loading="lazy" />
                                </ImageListItem>
                            ))
                        )}
                    </ImageList>
                </Grid>
            ) : (
                <>
                    <Typography
                        sx={{
                            color: "primary.contrastText",
                            ml: 1,
                        }}
                    >
                        You have no friend...
                    </Typography>
                </>
            )}
        </div>
    );
}
