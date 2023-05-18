import {
    Typography,
    Paper,
    Divider,
  } from "@mui/material";
import UserCard from "../RightSide/UserCard";
  
  export default function InterestedContainer() {
    return (
      <div>
        <Paper>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ p: 1, fontSize: "15px", fontWeight: "bold" }}>
              People who are interested
            </Typography>
          </Typography>
          <Divider light />
          <UserCard />
          <UserCard />
          <UserCard />
          <UserCard />
        </Paper>
      </div>
    );
  }
  