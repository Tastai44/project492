import * as React from "react";
import GroupContainer from "../../components/Groups/GroupContainer";
import { Modal, Box } from "@mui/material";
import AddGroup from "../../components/Groups/AddGroup";


import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IGroup } from "../../interface/Group";

export default function Groups() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [groupData, setGroupData] = React.useState<IGroup[]>([]);
  React.useEffect(() => {
    const fetchData = query(
      collection(dbFireStore, "groups"),
      orderBy("createAt", "desc")
    );
    const unsubscribe = onSnapshot(
      fetchData,
      (snapshot) => {
        const queriedData = snapshot.docs.map((doc) => doc.data() as IGroup);
        setGroupData(queriedData);
      },
      (error) => {
        console.error("Error fetching data", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddGroup closeEdit={handleClose} />
        </Box>
      </Modal>
      <GroupContainer 
        groupData={groupData}
        openAddGroup={handleOpen}
      />
    </>
  );
}
