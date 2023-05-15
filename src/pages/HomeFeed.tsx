// import * as React from "react";
import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import NavBar from "../components/Navigation";
import LeftSide from "../components/LeftSide";
import { styled } from "@mui/material/styles";
import MContainer from "../components/MContainer/MContainer";
import RightContainer from "../components/RightSide/RightContainer";
import PostForm from "../components/MContainer/PostForm";
import Box from "@mui/material/Box/Box";

export default function HomeFeed() {
  const Item = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));
  return (
    <>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={5}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
          >
            <Grid item xs={2}>
              <div style={{ position: "fixed" }}>
                <LeftSide />
              </div>
            </Grid>

            <Grid item xs={7}>
              <Item sx={{ backgroundColor: "#fff", margin: 1 }}>
                <PostForm />
              </Item>
              <Item>
                <MContainer />
              </Item>
            </Grid>

            <Grid item xs={2}>
              <div style={{ position: "fixed" }}>
                <RightContainer />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
