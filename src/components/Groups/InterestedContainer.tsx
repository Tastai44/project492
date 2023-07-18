import { Paper, Divider, Box } from "@mui/material";
import UserCard from "../RightSide/UserCard";
import { IMember } from "../../interface/Group";
import { NavLink } from "react-router-dom";
interface IData {
  members: IMember[];
}
export default function InterestedContainer({ members }: IData) {
  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: 1, fontSize: "20px", fontWeight: "bold" }}>Members</Box>
      </Box>
      <Divider light />
      {members.map((m) => (
        <Box key={m.uid}>
          <NavLink
            to={`/profileBlog/${m.uid}`}
            style={{color:"black"}}
          >
            <UserCard username={m.username} />
          </NavLink>
        </Box>
      ))}
    </Paper>
  );
}
