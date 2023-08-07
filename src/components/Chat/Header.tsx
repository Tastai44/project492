import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { User } from "../../interface/User";
import { StyledBadge } from "../RightSide/UserCard";

interface IData {
  inFoUser: User[];
}

export default function Header(props: IData) {
  return (
    <div>
      {props.inFoUser.map((user) => (
        <ListItem key={user.uid}>
          <ListItemAvatar>
            {user.isActive ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  src={user.profilePhoto}
                  sx={{ width: "40px", height: "40px" }}
                />
              </StyledBadge>
            ) : (
              <Avatar
                src={user.profilePhoto}
                sx={{ width: "40px", height: "40px" }}
              />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ fontSize: "16px", ml: -1 }}>
                <b>{`${user.firstName} ${user.lastName}`} </b>
              </Box>
            }
            secondary={
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "14px",
                  ml: -1,
                }}
              >
                {user.isActive ? `Active` : "Inactive"}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </div>
  );
}
