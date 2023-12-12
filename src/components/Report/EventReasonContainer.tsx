import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button, IconButton, Modal, Stack, Typography } from "@mui/material";

import DetailCard from "../../components/Events/DetailCard";
import LeftSideContainer from "../../components/Events/LeftSideContainer";
import CoverPhoto from "../../components/Events/CoverPhoto";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { dbFireStore, storage } from "../../config/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  onSnapshot,
  getDoc,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { EventPost, EventReport } from "../../interface/Event";
import ShareCard from "../../components/MContainer/ShareCard";
import { User } from "../../interface/User";
import { styleBoxPop } from "../../utils/styleBox";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PopupAlert from "../PopupAlert";
import ReasonContent from "./ReasonContent";
import InterestedContainer from "../Events/InterestedContainer";
import { StorageReference, listAll, getDownloadURL, ref } from "firebase/storage";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface IData {
  eventId: string;
  openReason: boolean;
  reportEvent: EventReport[];
  ownerId: string;
  imageUrls: string[];
}
interface IFunction {
  handleCloseReason: () => void;
}

export default function EventReasonContainer(props: IData & IFunction) {
  const [openShare, setOpenShare] = useState(false);
  const [data, setData] = useState<EventPost[]>([]);
  const [inFoUser, setInFoUser] = useState<User[]>([]);
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [reFreshImage, setReFreshImage] = useState(0);

  useEffect(() => {
    const fetchData = query(
      collection(dbFireStore, "events"),
      where("eventId", "==", props.eventId),
      orderBy("createAt", "desc")
    );
    const unsubscribe = onSnapshot(
      fetchData,
      (snapshot) => {
        const queriedData = snapshot.docs.map((doc) => doc.data() as EventPost);
        setData(queriedData);
      },
      (error) => {
        console.error("Error fetching data", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [props.eventId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userInfo.uid)
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) =>
          ({
            uid: doc.id,
            ...doc.data(),
          } as User)
        );
        setInFoUser(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo.uid]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const listRef: StorageReference = ref(storage, '/Images');
        const res = await listAll(listRef);
        const urls = await Promise.all(
          res.items.map(async (itemRef) => {
            const imageUrl = await getDownloadURL(itemRef);
            return imageUrl;
          })
        );
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [reFreshImage]);

  const handleOpenShare = () => setOpenShare(true);
  const handleCloseShare = () => setOpenShare(false);

  const handleDelete = () => {
    const postRef = doc(dbFireStore, "events", props.eventId);
    getDoc(postRef);
    deleteDoc(postRef)
      .then(() => {
        PopupAlert("Post deleted successfully", "success");
        console.log("Post deleted successfully");
      })
      .catch((error) => {
        PopupAlert("Error deleting post", "error");
        console.error("Error deleting post: ", error);
      });
  };

  const handleApprove = async () => {
    const IndexReport = props.reportEvent.findIndex((index) => index.eventId === props.eventId);
    try {
      const queryPost = query(collection(dbFireStore, "events"), where("eventId", "==", props.eventId));
      const querySnapshot = await getDocs(queryPost);

      const doc = querySnapshot.docs[0];
      if (doc.exists()) {
        const eventData = { eventId: doc.id, ...doc.data() } as EventPost;
        const updateReport = [...eventData.reportEvent];
        updateReport.splice(IndexReport, 1);
        const updatedData = { ...eventData, reportEvent: updateReport };
        await updateDoc(doc.ref, updatedData);
        PopupAlert("Report approved successfully", "success");
      } else {
        PopupAlert("No post found with the specified ID", "error");
      }
    } catch (error) {
      console.error("Error approving report:", error);
    }
  };


  return (
    <div>
      <Modal
        open={props.openReason}
        onClose={props.handleCloseReason}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleBoxPop}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <IconButton onClick={props.handleCloseReason}>
              <CancelIcon />
            </IconButton>
            <Box>
              <Button
                onClick={handleApprove}
                startIcon={<AddTaskIcon />}
                sx={{
                  fontSize: "16px",
                  backgroundColor: "primary.main",
                  color: "white",
                  mr: 1,
                  "&:hover": {
                    color: "white",
                    backgroundColor: "grey",
                  },
                }}
              >
                Approve
              </Button>
              <Button
                onClick={handleDelete}
                startIcon={<DeleteOutlineOutlinedIcon />}
                sx={{
                  fontSize: "16px",
                  backgroundColor: "grey",
                  color: "white",
                  "&:hover": {
                    color: "black",
                    backgroundColor: "primary.contrastText",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>

          {data.map((e) => (
            <Grid key={e.eventId} sx={{ flexGrow: 1 }} container marginTop={5}>
              <Grid
                container
                justifyContent="space-between"
                paddingLeft={5}
                paddingRight={5}
                spacing={10}
              >
                <Grid item xs={12}>
                  <Item>
                    <Box sx={{ width: "100%" }}>
                      <Stack>
                        <Item sx={{ mb: 0 }}>
                          <CoverPhoto
                            coverPhoto={e.coverPhoto}
                            title={e.title}
                            startDate={e.startDate}
                            startTime={e.startTime}
                            eventId={e.eventId}
                            endDate={e.endDate}
                            endTime={e.endTime}
                            topic={e.topic}
                            ageRage={e.ageRage}
                            interest={e.interest}
                            owner={e.owner}
                            handleOpenShare={handleOpenShare}
                            details={e.details}
                            status={e.status}
                            location={e.location}
                            imageUrls={imageUrls}
                            handleReFreshImage={() => setReFreshImage(pre => pre + 1)}
                          />
                        </Item>
                        <ShareCard
                          openShare={openShare}
                          handleCloseShare={handleCloseShare}
                          friendList={
                            inFoUser.find((user) => user.friendList)
                              ?.friendList ?? []
                          }
                          eventId={e.eventId}
                          imageUrls={imageUrls}
                          owner={e.owner}
                        />
                        <Item>
                          <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={2.5}>
                                <Item>
                                  <LeftSideContainer
                                    evenetData={data}
                                    imageUrls={imageUrls}
                                  />
                                </Item>
                              </Grid>
                              <Grid item xs={12} md={7}>
                                <Item>
                                  <DetailCard
                                    details={e.details}
                                    eventId={e.eventId}
                                  />
                                </Item>
                                <Item>
                                  <Box
                                    sx={{
                                      mt: 2,
                                      mb: 2,
                                      height: "380px",
                                      maxHeight: "500px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {e.reportEvent.length !== 0 ? (
                                      <>
                                        <Typography sx={{ color: "black", fontSize: "20px", fontWeight: "bold" }}>Reason of report</Typography>
                                        {e.reportEvent.map((report, index) => (
                                          <Box key={index}>
                                            <ReasonContent
                                              text={report.reason}
                                              createAt={report.createAt}
                                              userId={report.reportBy}
                                              imageUrls={props.imageUrls}
                                            />
                                          </Box>
                                        ))}
                                      </>
                                    ) : (
                                      <Box>There are report reasons!</Box>
                                    )}
                                  </Box>
                                </Item>
                              </Grid>
                              <Grid item xs={2.5}>
                                <Item>
                                  <InterestedContainer
                                    interestedPeople={e.interest}
                                  />
                                </Item>
                              </Grid>
                            </Grid>
                          </Box>
                        </Item>
                      </Stack>
                    </Box>
                  </Item>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Modal>
    </div>
  );
}
