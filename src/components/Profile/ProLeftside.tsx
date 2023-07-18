import * as React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { NavLink, useParams } from "react-router-dom";
import EditProfile from "./EditProfile";
import { User } from "../../interface/User";
import {
  collection,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import CancelIcon from "@mui/icons-material/Cancel";
import { stylePreviewPhoto } from "../../utils/styleBox";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface IFunction {
  handleRefreshData: () => void;
}

export default function ProLeftside({ handleRefreshData }: IFunction) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openPre, setOpenPre] = React.useState(false);
  const handleOpenPre = () => setOpenPre(true);
  const handleClosePre = () => setOpenPre(false);

  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };

  const { userId } = useParams();
  const [inFoUser, setInFoUser] = React.useState<User[]>([]);
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "==", userId)
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
  }, [userId, reFresh]);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      try {
        const selectedFiles = Array.from(files);
        const readerPromises = selectedFiles.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        const base64Images = await Promise.all(readerPromises);
        setPreviewImages(base64Images);
        handleOpenPre();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleClearImage = () => {
    setPreviewImages([]);
    handleClosePre();
  };

  const handleEditPhotoProfile = async () => {
    try {
      const q = query(
        collection(dbFireStore, "users"),
        where("uid", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];

      if (doc.exists()) {
        await updateDoc(doc.ref, {
          profilePhoto: previewImages[0],
        });
        handleClearImage();
        handleRefresh();
        handleRefreshData();
      } else {
        console.log("Profile does not exist");
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <>
      <Modal
        open={openPre}
        onClose={handleClosePre}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={stylePreviewPhoto}>
          {previewImages.length !== 0 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={handleClearImage}>
                  <CancelIcon sx={{ color: "black" }} />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {previewImages.map((image, index) => (
                  <Card key={index} sx={{ width: "50%", height: "auto" }}>
                    <CardMedia
                      component="img"
                      image={image}
                      alt="Paella dish"
                    />
                  </Card>
                ))}
              </Box>
            </Box>
          )}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, m: 1 }}
          >
            <Button
              sx={{
                backgroundColor: "grey",
                color: "white",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#E1E1E1",
                },
              }}
              onClick={handleClosePre}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "#8E51E2",
                color: "white",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#E1E1E1",
                },
              }}
              onClick={handleEditPhotoProfile}
              type="submit"
            >
              Upload
            </Button>
          </Box>
        </Box>
      </Modal>
      {inFoUser.map((m) => (
        <Box key={m.uid}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>
              <EditProfile
                closeEdit={handleClose}
                handleRefresh={handleRefresh}
                handleRefreshData={handleRefreshData}
                userId={userId}
                username={m.username}
                firstName={m.firstName}
                lastName={m.lastName}
                email={m.email}
                aboutMe={m.aboutMe}
                faculty={m.faculty}
                instagram={m.instagram}
                statusDefault={m.status}
                yearDefault={m.year}
              />
            </Box>
          </Modal>
          <div style={{ position: "fixed" }}>
            <Box sx={{ width: "100%" }}>
              <Stack spacing={2}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <Box onClick={handleUploadClick}>
                          <IconButton
                            sx={{
                              backgroundColor: "white",
                              "&:hover": {
                                color: "white",
                                backgroundColor: "black",
                              },
                            }}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              multiple
                              hidden
                            />
                            <AddAPhotoIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <Avatar
                        alt="Travis Howard"
                        src={m.profilePhoto}
                        sx={{ width: "186px", height: "186px" }}
                      />
                    </Badge>
                  </Stack>
                </Item>
                <Item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                    gap: "5px",
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {m.firstName} {m.lastName}
                  </div>
                  <div>@{m.username}</div>
                  {userInfo.uid == m.uid ? (
                    <Button
                      size="small"
                      sx={{
                        width: "30px",
                        fontSize:"16px",
                        alignItems:"center",
                        backgroundColor: "#8E51E2",
                        color: "white",
                        "&:hover": {
                          color: "black",
                          backgroundColor: "white",
                        },
                      }}
                      startIcon={<BorderColorOutlinedIcon sx={{width:"16px"}} />}
                      onClick={handleOpen}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      sx={{
                        width: "100px",
                        backgroundColor: "#8E51E2",
                        color: "white",
                        "&:hover": {
                          color: "black",
                          backgroundColor: "white",
                        },
                      }}
                    >
                      Add Friend
                    </Button>
                  )}
                </Item>
                <Divider style={{ background: "#EAEAEA" }} />

                <Item>
                  <nav aria-label="secondary mailbox folders">
                    <List>
                      <ListItem disablePadding>
                        <NavLink
                          to={`/profileBlog/${userId}`}
                          style={({ isActive, isPending }) => {
                            return {
                              fontWeight: isPending ? "bold" : "",
                              color: isActive ? "black" : "grey",
                              backgroundColor: isActive ? "#B8B8B8" : "",
                              width: isActive ? "100%" : "100%",
                            };
                          }}
                        >
                          <ListItemButton>
                            <ListItemText primary="Blog" />
                          </ListItemButton>
                        </NavLink>
                      </ListItem>
                      <ListItem disablePadding>
                        <NavLink
                          to={`/aboutMe/${userId}`}
                          style={({ isActive, isPending }) => {
                            return {
                              fontWeight: isPending ? "bold" : "",
                              color: isActive ? "black" : "grey",
                              backgroundColor: isActive ? "#B8B8B8" : "",
                              width: isActive ? "100%" : "100%",
                            };
                          }}
                        >
                          <ListItemButton>
                            <ListItemText primary="About Me" />
                          </ListItemButton>
                        </NavLink>
                      </ListItem>
                      <ListItem disablePadding>
                        <NavLink
                          to={`/friends/${userId}`}
                          style={({ isActive, isPending }) => {
                            return {
                              fontWeight: isPending ? "bold" : "",
                              color: isActive ? "black" : "grey",
                              backgroundColor: isActive ? "#B8B8B8" : "",
                              width: isActive ? "100%" : "100%",
                            };
                          }}
                        >
                          <ListItemButton>
                            <ListItemText primary="Friends" />
                          </ListItemButton>
                        </NavLink>
                      </ListItem>
                      <ListItem disablePadding>
                        <NavLink
                          to={`/collections/${userId}`}
                          style={({ isActive, isPending }) => {
                            return {
                              fontWeight: isPending ? "bold" : "",
                              color: isActive ? "black" : "grey",
                              backgroundColor: isActive ? "#B8B8B8" : "",
                              width: isActive ? "100%" : "100%",
                            };
                          }}
                        >
                          <ListItemButton>
                            <ListItemText primary="Collections" />
                          </ListItemButton>
                        </NavLink>
                      </ListItem>
                    </List>
                  </nav>
                </Item>
              </Stack>
            </Box>
          </div>
        </Box>
      ))}
    </>
  );
}
