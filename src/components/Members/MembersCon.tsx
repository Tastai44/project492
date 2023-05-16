
import Grid from "@mui/material/Grid";
import MemberCard from "./MemberCard";

export default function MembersCon() {
  return (
    <Grid sx={{ flexGrow: 1, gap:"30px" }} container>
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
    </Grid>
  );
}
