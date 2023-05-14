import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";
import ProLeftside from "../components/Profile/ProLeftside";
import ProCoverImage from "../components/Profile/ProCoverImage";
import MContainer from "../components/MContainer/MContainer";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function ProfileBlog() {
  return (
    <div>
      <Grid sx={{ flexGrow: 1 }} container marginTop={5}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
            spacing={2}
          >
            <Grid item xs={3}>
              <Item sx={{ backgroundColor: "#EEECEF" }}>
                <ProLeftside />
              </Item>
            </Grid>

            <Grid item xs={9}>
              <Item>
                <Box sx={{ width: "100%" }}>
                  <Stack spacing={2}>
                    <Item>
                      <ProCoverImage />
                    </Item>
                    <Item>
                    <MContainer/>
                    </Item>
                  </Stack>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
