// import * as React from "react";
import Grid from "@mui/material/Grid";
import LeftSide from "../components/LeftSide";
import MembersCon from "../components/Members/MembersCon";

export default function Members() {

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
            xs={9}
            >
                <MembersCon />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
