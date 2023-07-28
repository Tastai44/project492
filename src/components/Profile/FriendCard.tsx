import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";

interface IData {
  username: string;
  profilePhoto?: string;
  uid: string;
}

export default function FriendCard(props: IData) {
  return (
    <Card
      sx={{
        width: 210,
        background: "linear-gradient(to bottom, #000000, #CECCCC8A)",
        margin: "10px",
      }}
    >
      <CardMedia
        component="img"
        height="194"
        image={props.profilePhoto}
        alt="userPicture"
      />
      <CardContent>
        <Typography variant="body2" color="white" sx={{ fontSize: "20px" }}>
          {props.username}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{ display: "flex", justifyContent: "center", gap: 1 }}
      >
        <NavLink to={`/profileBlog/${props.uid}`}>
          <Button
            sx={{
              color: "white",
              borderRadius: "5px",
              backgroundColor: "#920EFA",
              "&:hover": { backgroundColor: "white", color: "black" },
            }}
          >
            View
          </Button>
        </NavLink>
        <Button
          sx={{
            color: "white",
            borderRadius: "5px",
            backgroundColor: "grey",
            "&:hover": { backgroundColor: "white", color: "black" },
          }}
        >
          UnFriend
        </Button>
      </CardActions>
    </Card>
  );
}
