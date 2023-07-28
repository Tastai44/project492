import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IFriendList } from "../../interface/User";

interface IData {
  username: string;
  profilePhoto: string;
  uId: string;
}
interface IFunction {
  handleRefresh: () => void;
}

export default function MemberCard(props: IData & IFunction) {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const handleAddFriend = async () => {
    const addFriend : IFriendList = {
      status: true,
      friendId: props.uId,
      username: props.username,
      profilePhoto: props.profilePhoto,
      createdAt: new Date().toLocaleString(),
    };
    const querySnapshot = await getDocs(
      query(collection(dbFireStore, "users"), where("uid", "==", userInfo.uid))
    );
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(dbFireStore, "users", userDoc.id);
      updateDoc(userRef, {
        friendList: arrayUnion(addFriend),
      })
        .then(() => {
          props.handleRefresh();
          console.log("Successfully added friend to the friendList.");
        })
        .catch((error) => {
          console.error("Error adding friend to the friendList: ", error);
        });
    }
  };
  return (
    <Card sx={{ width: 250 }}>
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          background: "white",
        }}
      >
        <Button
          sx={{
            fontSize: "14px",
            color: "white",
            borderRadius: "5px",
            backgroundColor: "#A005FF",
            "&:hover": { color: "black", backgroundColor: "#F1F1F1" },
          }}
          onClick={() => handleAddFriend()}
        >
          Add Friend
        </Button>
        <Button
          sx={{
            fontSize: "14px",
            color: "white",
            borderRadius: "5px",
            backgroundColor: "grey",
            "&:hover": { color: "black", backgroundColor: "#F1F1F1" },
          }}
        >
          UnKnow
        </Button>
      </CardActions>
      {props.profilePhoto ? (
        <CardMedia
          component="img"
          height="194"
          image={props.profilePhoto}
          alt="userPicture"
        />
      ) : (
        <Box sx={{ width: "100%", backgroundColor: "primary.contrastText" }}>
          <AccountBoxIcon sx={{ fontSize: "200px", color: "white" }} />
        </Box>
      )}

      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "20px" }}
        >
          {props.username}
        </Typography>
      </CardContent>
    </Card>
  );
}
