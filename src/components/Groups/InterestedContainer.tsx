import { Paper, Divider, Box } from "@mui/material";
import UserCard from "../RightSide/UserCard";

export default function InterestedContainer() {
  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: 1, fontSize: "15px", fontWeight: "bold" }}>
          Members
        </Box>
      </Box>
      <Divider light />
      <UserCard />
      <UserCard />
      <UserCard />
      <UserCard />
    </Paper>
  );
}
