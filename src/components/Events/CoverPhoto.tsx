import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DateRangeIcon from "@mui/icons-material/DateRange";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  where,
  arrayUnion,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { EventPost, Interest } from "../../interface/Event";

interface IData {
  eventId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  title: string;
  coverPhoto: string[];
  topic: string;
  ageRage: number;
  interest: Interest[];
}

interface IFunction {
  handleRefresh: () => void;
}

export default function ProCoverImage({
  eventId,
  startDate,
  startTime,
  endDate,
  endTime,
  title,
  coverPhoto,
  topic,
  ageRage,
  interest,
  handleRefresh,
}: IData & IFunction) {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const isInterest = interest.some((f) => f.interestBy === userInfo.uid);
console.log(isInterest)
  const increaseInterest = () => {
    const eventtsCollection = collection(dbFireStore, "events");
    const updateInterest = {
      interestBy: userInfo.uid,
      createdAt: new Date().toLocaleString(),
    };
    const postRef = doc(eventtsCollection, eventId);
    updateDoc(postRef, {
      interest: arrayUnion(updateInterest),
    })
      .then(() => {
        handleRefresh();
      })
      .catch((error) => {
        console.error("Error adding interest: ", error);
      });
  };

  const decreaseInterest = async (id: string) => {
    const IndexLike = interest.findIndex((f) => f.interestBy === userInfo.uid);
    try {
      const q = query(
        collection(dbFireStore, "events"),
        where("__name__", "==", id)
      );
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      if (doc.exists()) {
        const postData = { id: doc.id, ...doc.data() } as EventPost;
        const updatedLike = [...postData.interest];
        updatedLike.splice(IndexLike, 1);
        const updatedData = { ...postData, interest: updatedLike };
        await updateDoc(doc.ref, updatedData);
        handleRefresh();
      } else {
        console.log("No event found with the specified ID");
      }
    } catch (error) {
      console.error("Error deleting interest:", error);
    }
  };


  return (
    <div>
      <Card sx={{ maxWidth: "100%" }}>
        {coverPhoto.map((cover, index) => (
          <CardMedia
            key={index}
            sx={{ height: 300 }}
            image={cover}
            title="green iguana"
          />
        ))}
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-50px",
        }}
      >
        <Card sx={{ width: "95%", backgroundColor: "white", display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box
              sx={{
                mt: 1,
                ml: 1,
                display: "flex",
                justifyContent: "flex-start",
                fontSize: "20px",
              }}
            >
              {title}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box sx={{ ml: 1 }}>
                <Button color="error" startIcon={<LocationOnIcon />}>
                  Location
                </Button>
              </Box>
              <Box sx={{ display: "flex" }}>
                <IconButton size="large">
                  <ShareIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: isInterest ? "primary.main" : !isInterest ? "white" : "white",
                    color: isInterest ? "white" : !isInterest ? "black" : "black",
                    border: "1px solid",
                    "&:hover": {
                      color: "white",
                      border: "1px solid",
                      backgroundColor: "primary.main",
                    },
                    m: 1,
                  }}
                  onClick={
                    isInterest ? () => decreaseInterest(eventId) : () => increaseInterest()
                  }
                  startIcon={<FavoriteIcon sx={{width:"16px"}}/>}
                >
                  {isInterest ? "Interested" : "Interest"}
                </Button>
              </Box>
            </Box>
            <Divider light sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                <DateRangeIcon />
                <div>
                  {" "}
                  <b>Start:</b> {startDate}, {startTime} | <b>End:</b> {endDate}
                  , {endTime}
                </div>
              </Box>
              <Box sx={{ display: "flex", gap: 1, m: 1, alignItems: "center" }}>
                {/* <TagIcon /> */}
                <div>
                  {topic} | {ageRage}+
                </div>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}
