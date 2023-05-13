import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import LeftSide from "../components/LeftSide";
import { Card } from "@mui/material";
import MContainer from "../components/MContainer/MContainer";

export default function SpacingGrid() {

  return (
    <>
    <PrimarySearchAppBar/>
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
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
            >
                <MContainer />
            </Grid>

            <Grid item 
            sx={{
                height: "100vh",
                width: "30vh",
                color:"black",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}>
                sd
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
