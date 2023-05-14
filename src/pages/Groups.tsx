import Grid from "@mui/material/Grid";
import LeftSide from "../components/LeftSide";
import RightContainer from "../components/RightSide/RightContainer";
import GroupContainer from "../components/Groups/GroupContainer";

export default function Groups() {

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
                <GroupContainer />
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
