import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import NavBar from "../components/Navigation";
import LeftSide from "../components/LeftSide";
import { Card } from "@mui/material";
import MContainer from "../components/MContainer/MContainer";
import RightContainer from "../components/RightSide/RightContainer";

export default function SpacingGrid() {

  return (
    <>
    <NavBar/>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} marginTop={10}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="space-between"
            paddingLeft={5}
            paddingRight={5}
          >
            <Grid item 
            sx={{
                height: "100vh",
                width: "30vh",
                border:"none",
              }}>
                <div style={{position:"fixed"}}><LeftSide /></div>
                
            </Grid>

            <Grid item
            sx={{
                height: "100vh",
                width: "100vh",
                color:"black",
                backgroundColor: "#EEECEF"
              }}
            >
                <MContainer />
            </Grid>

            <Grid item 
            sx={{
                height: "100vh",
                width: "30vh",
                color:"black",
                backgroundColor: "#EEECEF"
              }}>
                <div style={{position:"fixed"}}><RightContainer /></div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
