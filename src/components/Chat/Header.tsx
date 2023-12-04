import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
} from "@mui/material";
import { User } from "../../interface/User";
import { StyledBadge } from "../RightSide/UserCard";


interface IData {
  inFoUser: User[];
  imageUrls: string[];
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
                  src={props.imageUrls.find((item) => item.includes(user.profilePhoto ?? ''))}
                  sx={{ width: "40px", height: "40px" }}
                />
              </StyledBadge>
            ) : (
              <Avatar
                src={props.imageUrls.find((item) => item.includes(user.profilePhoto ?? ''))}
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 0.5,
                  fontSize: "12px",
                  ml: -1,
                  color: 'white',
                }}
              >
                {user.isActive ? `Active` : "Inactive"}
              </Box>
            }
          />
        </ListItem>
      ))}
    </div>
  );
}
