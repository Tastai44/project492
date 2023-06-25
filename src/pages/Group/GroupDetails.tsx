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
                            {/* <PostForm /> */}
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
