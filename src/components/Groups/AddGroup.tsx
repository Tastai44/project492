import {
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import React from "react";
import { IGroup } from "../../interface/Group";

import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { doc, getDocs } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import { User } from "../../interface/User";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Ihandle {
  closeEdit: () => void;
  handleRefresh: () => void;
}

export default function AddGroup({ closeEdit, handleRefresh }: Ihandle) {
  const theme = useTheme();
  const [member, setMember] = React.useState<string[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = collection(dbFireStore, "users");
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map(
          (doc) =>
            ({
              uid: doc.id,
              ...doc.data(),
            } as User)
        );
        setUsers(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddMember = (event: SelectChangeEvent<typeof member>) => {
    const {
      target: { value },
    } = event;
    setMember(typeof value === "string" ? value.split(",") : value);
  };

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
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleClearImage = () => {
    setPreviewImages([]);
  };

  const [status, setStatus] = React.useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const initialState = {
    gId: "",
    hostId: "",
    groupName: "",
    members: [],
    status: "",
    details: "",
    coverPhoto: "",
    createAt: "",
  };
  const [group, setGroup] = React.useState<IGroup>(initialState);
  const clearState = () => {
    setGroup({ ...initialState });
    handleClearImage();
  };

  const handleChangeGroup = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setGroup((prevGroup) => ({
      ...prevGroup,
      [name]: value,
    }));
  };

  const createGroup = async () => {
    const postCollection = collection(dbFireStore, "groups");
    const tmp = [...member].map((m) => JSON.parse(m));
    const tmp2 = [...tmp].map((m) => {
      return {
        uid: m.uid,
        username: `${m.firstName} ${m.lastName}`,
      };
    });
    const newPost = {
      gId: "",
      hostId: userInfo.uid,
      groupName: group.groupName,
      members: tmp2,
      status: status,
      details: group.details,
      coverPhoto: previewImages[0],
      createAt: new Date().toLocaleString(),
    };

    try {
      const docRef = doc(postCollection);
      const groupId = docRef.id;
      const updatedPost = { ...newPost, gId: groupId };
      await setDoc(docRef, updatedPost);

      setGroup(updatedPost);
      clearState();
      alert("Success!");
      handleRefresh();
      closeEdit();
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div style={{ color: "black" }}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5">
          Create a group
        </Typography>
        <Divider sx={{ background: "grey" }} />
        <Box sx={{ mt: 1 }}>
          <TextField
            sx={{ width: "100%" }}
            id="outlined-basic"
            label="Group Name"
            variant="outlined"
            name="groupName"
            onChange={handleChangeGroup}
            value={group.groupName}
          />

          <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-multiple-checkbox-label">Members</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={member}
                onChange={handleAddMember}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const temp = JSON.parse(value);
                      return (
                        <Chip
                          key={temp.uid}
                          label={`${temp.firstName} ${temp.lastName}`}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {users.map((e) => (
                  <MenuItem
                    key={e.uid}
                    value={JSON.stringify(e)}
                    style={getStyles(e.firstName, member, theme)}
                  >
                    {`${e.firstName} ${e.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1 }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select">Status</InputLabel>
              <Select
                label="Status"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                onChange={handleChange}
              >
                <MenuItem value={"Private"}>
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "end",
                      gap: 0.5,
                    }}
                  >
                    <LockIcon /> Private
                  </Box>
                </MenuItem>
                <MenuItem value={"Public"}>
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "end",
                      gap: 0.5,
                    }}
                  >
                    <PublicIcon /> Public
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            sx={{ width: "100%", mb: 1 }}
            id="outlined-basic"
            label="Details"
            variant="outlined"
            multiline
            name="details"
            onChange={handleChangeGroup}
            value={group.details}
          />
          <FormControl
            sx={{ width: "100%", mb: 1 }}
            variant="outlined"
            onClick={handleUploadClick}
          >
            <OutlinedInput
              id="outlined-insertPhoto"
              type={"file"}
              inputProps={{ "aria-label": " " }}
              ref={fileInputRef}
              onChange={handleFileChange}
              endAdornment={
                <InputAdornment position="end" sx={{ fontSize: "20px" }}>
                  Cover photo
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Typography
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
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
            onClick={closeEdit}
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
            onClick={createGroup}
            type="submit"
          >
            Save
          </Button>
        </Typography>
        {previewImages.length !== 0 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={handleClearImage}>
                <CancelIcon />
              </IconButton>
            </Box>
            <ImageList
              sx={{ width: "100%", height: "auto", maxHeight: "400px" }}
              cols={1}
              rowHeight={160}
            >
              {previewImages.map((image, index) => (
                <ImageListItem key={index}>
                  <img src={image} alt={`Preview ${index}`} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}
      </Box>
    </div>
  );
}
