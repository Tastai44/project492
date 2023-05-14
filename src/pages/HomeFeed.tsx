// import * as React from "react";
import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import NavBar from "../components/Navigation";
import LeftSide from "../components/LeftSide";
// import { Card } from "@mui/material";
import MContainer from "../components/MContainer/MContainer";
import RightContainer from "../components/RightSide/RightContainer";

export default function HomeFeed() {

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
            <Grid item 
            xs={2}>
                <div style={{position:"fixed"}}><LeftSide /></div>
                
            </Grid>

            <Grid item
            xs={7}
            >
                <MContainer />
            </Grid>

            <Grid item 
            xs={2}>
                <div style={{position:"fixed"}}><RightContainer /></div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
