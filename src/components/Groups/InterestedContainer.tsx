import { Paper, Divider, Box } from "@mui/material";
import UserCard from "../RightSide/UserCard";
import { IMember } from "../../interface/Group";
interface IData {
  members: IMember[];
}
export default function InterestedContainer({members} : IData) {
  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: 1, fontSize: "20px", fontWeight: "bold" }}>
          Members
        </Box>
      </Box>
      <Divider light />
      {members.map((m) => (
        <Box key={m.uid}>
          <UserCard 
            username={m.username}
          />
      </Box>
      ))}
      
      
    </Paper>
  );
}
