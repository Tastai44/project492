import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Luffy from "../../../public/pictures/Luffy.webp";
import { Typography } from "@mui/material";

export const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface IData {
  username: string;
}

export default function UserCard({username} : IData) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        p:1,
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        "&:hover": {
          backgroundColor: "#F1F1F1",
          color: "black",
        },
      }}
    >
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Avatar alt="Remy Sharp" src={Luffy} />
      </StyledBadge>
      <Typography sx={{fontSize:"16px"}}>{username}</Typography>
    </Stack>
  );
}
