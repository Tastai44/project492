import { Paper, Divider, Box } from "@mui/material";
import UserCard from "../RightSide/UserCard";
import { Interest } from "../../interface/Event";
import { NavLink } from "react-router-dom";

interface IData {
    interestedPeople: Interest[];
}

export default function InterestedContainer({ interestedPeople }: IData) {
    return (
        <Paper sx={{ display: { xs: "none", md: "block", borderRadius: "10px" } }}>
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
            {interestedPeople.map((item) => (
                <NavLink key={item.interestBy} to={`/profileBlog/${item.interestBy}`} style={{ color: "black" }}>
                    <UserCard key={item.interestBy} userId={item.interestBy} />
                </NavLink>
            ))}
        </Paper>
    );
}
