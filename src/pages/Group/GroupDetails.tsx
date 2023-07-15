import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

import CoverPhoto from "../../components/Groups/CoverPhoto";
import LeftSideContainer from "../../components/Groups/LeftSideContainer";
import PostForm from "../../components/MContainer/PostForm";
import MContainer from "../../components/MContainer/MContainer";
import AboutGroup from "../../components/Groups/AboutGroup";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function GroupDetails() {
  // const { userId } = useParams();

  // const [reFresh, setReFresh] = React.useState(0);
  // const handleRefresh = () => {
  //   setReFresh((pre) => pre + 1);
  // };

  // const [data, setData] = React.useState<Post[]>([]);
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const q = query(
  //         collection(dbFireStore, "posts"),
  //         where("owner", "==", userId),
  //         orderBy("createAt", "desc")
  //       );
  //       const querySnapshot = await getDocs(q);
  //       const queriedData = querySnapshot.docs.map((doc) => doc.data() as Post);
  //       setData(queriedData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [reFresh, userId]);

  return (
    <div>
      <Grid sx={{ flexGrow: 1 }} container marginTop={5}>
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
                    <CoverPhoto />
                  </Item>
                  <Item>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={2.5}>
                          <Item>
                            <LeftSideContainer />
                          </Item>
                        </Grid>
                        <Grid item xs={7}>
                          <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                            {/* <PostForm handdleReFresh={handleRefresh} /> */}
                          </Item>
                          <Item>
                            {/* <MContainer /> */}
                          </Item>
                        </Grid>
                        <Grid item xs={2.5}>
                          <Item>
                            <AboutGroup />
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
    </div>
  );
}
