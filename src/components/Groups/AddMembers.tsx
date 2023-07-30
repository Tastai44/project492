import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { styleBox } from "../../utils/styleBox";
import "firebase/database";
import { dbFireStore } from "../../config/firebase";
import { User } from "../../interface/User";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

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

interface IFunction {
  handleClose: () => void;
  handleRefresh: () => void;
}

interface IData {
  gId: string;
}

export default function AddMembers(props: IFunction & IData) {
  const theme = useTheme();
  const [member, setMember] = React.useState<string[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  // const userInfo = JSON.parse(localStorage.getItem("user") || "null");

  const handleAddMember = (event: SelectChangeEvent<typeof member>) => {
    const {
      target: { value },
    } = event;
    setMember(typeof value === "string" ? value.split(",") : value);
  };

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

  const addMember = () => {
    const groupCollection = collection(dbFireStore, "groups");
    const tmp = [...member].map((m) => JSON.parse(m));
    const tmp2 = tmp.map((m) => {
      return {
        uid: m.uid,
        username: `${m.firstName} ${m.lastName}`,
        profilePhoto: m.profilePhoto,
      };
    });
    const groupRef = doc(groupCollection, props.gId);
    updateDoc(groupRef, {
      members: arrayUnion(...tmp2),
    })
      .then(() => {
        props.handleRefresh();
        props.handleClose();
      })
      .catch((error) => {
        console.error("Error adding likes: ", error);
      });
  };

  return (
    <div>
      <Box sx={styleBox}>
        <Box
          sx={{
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb:1
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h5"
            sx={{ color: "black" }}
          >
            Add Members
          </Typography>
        </Box>
        <Divider sx={{ background: "grey" }} />
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
        <Box
          sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}
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
            onClick={props.handleClose}
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
            onClick={addMember}
            type="submit"
          >
            Add
          </Button>
        </Box>
      </Box>
    </div>
  );
}
