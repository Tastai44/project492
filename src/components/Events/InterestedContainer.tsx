import { Paper, Divider, Box } from "@mui/material";
import UserCard from "../RightSide/UserCard";
import { Interest } from "../../interface/Event";
import { NavLink } from "react-router-dom";

interface IData {
  interestedPeople: Interest[];
}

export default function InterestedContainer({ interestedPeople }: IData) {
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
          People who are interested
        </Box>
      </Box>
      <Divider light />
      {interestedPeople.map((i) => (
        <NavLink key={i.interestBy} to={`/profileBlog/${i.interestBy}`} style={{ color: "black" }}>
          <UserCard key={i.interestBy} userId={i.interestBy} />
        </NavLink>
      ))}
    </Paper>
  );
}
