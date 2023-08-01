import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styleTable } from "../../utils/styleBox";
import {
  Avatar,
  Button,
  Typography,
  Divider,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase } from "../Navigation";
import SearchIcon from "@mui/icons-material/Search";
import { IFriendList } from "../../interface/User";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1 },
  {
    field: "profilePhoto",
    headerName: "Profile Photo",
    renderCell: (params) => (
      <Avatar
        src={params.value}
        alt={`Profile of ${params.row.username}`}
        style={{ width: "50px", height: "50px" }}
      />
    ),
    width: 150,
    flex: 1,
  },
  {
    field: "username",
    headerName: "Full Name",
    width: 150,
    flex: 1,
  },
];

interface IData {
  friendList: IFriendList[];
  openShare: boolean;
}
interface IFunction {
  handleCloseShare: () => void;
}

export default function ShareCard(props: IData & IFunction) {
  // const isShare = props.shareUsers.some((share) => share.shareBy === userInfo.uid);
  // const handleShare = async () => {
  //   try {
  //     const postsCollection = collection(dbFireStore, "posts");
  //     const updateShare = {
  //       shareBy: userInfo.uid,
  //       createdAt: new Date().toLocaleString(),
  //     };
  //     const postRef = doc(postsCollection, props.postId);
  //     updateDoc(postRef, {
  //       shareUsers: arrayUnion(updateShare),
  //     })
  //       .then(() => {
  //         props.handleRefresh();
  //       })
  //       .catch((error) => {
  //         console.error("Error share", error);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const unShare = async (id: string) => {
  //   const IndexShare = props.shareUsers.findIndex(
  //     (index) => index.shareBy === userInfo.uid
  //   );
  //   try {
  //     const queyShare = query(
  //       collection(dbFireStore, "posts"),
  //       where("id", "==", id)
  //     );
  //     const querySnapshot = await getDocs(queyShare);

  //     const doc = querySnapshot.docs[0];
  //     if (doc.exists()) {
  //       const postData = { id: doc.id, ...doc.data() } as Post;
  //       const updateShare = [...postData.shareUsers];
  //       updateShare.splice(IndexShare, 1);
  //       const updateData = { ...postData, shareUsers: updateShare };
  //       await updateDoc(doc.ref, updateData);
  //       props.handleRefresh();
  //     } else {
  //       console.log("No post found with the specified ID");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const rows = props.friendList.map((row) => ({
    id: row.friendId,
    username: row.username,
    profilePhoto: row.profilePhoto,
  }));
  return (
    <Modal open={props.openShare} onClose={props.handleCloseShare}>
      <Box sx={styleTable}>
        <Box
          sx={{
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h5"
            sx={{ color: "black" }}
          >
            Share Lists
          </Typography>
          <Box sx={{display:"flex"}}>
            <FormControl size="small" sx={{ width: "120px" }}>
              <InputLabel id="demo-simple-select">Status</InputLabel>
              <Select
                label="Status"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={status}
                // onChange={handleChange}
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
                <MenuItem value={"Friend"}>
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "end",
                      gap: 0.5,
                    }}
                  >
                    <GroupIcon /> Friend
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
            <Search
              sx={{
                backgroundColor: "#F1F1F1",
                "&:hover": { backgroundColor: "#C5C5C5" },
              }}
            >
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>
        </Box>
        <Divider sx={{ background: "grey", mb: 1 }} />
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}
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
            onClick={props.handleCloseShare}
          >
            Cancle
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
          >
            Share
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
