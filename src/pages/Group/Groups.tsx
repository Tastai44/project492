import * as React from "react";
import GroupContainer from "../../components/Groups/GroupContainer";
import { Modal, Box } from "@mui/material";
import AddGroup from "../../components/Groups/AddGroup";


import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
import { IGroup } from "../../interface/Group";

export default function Groups() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [reFresh, setReFresh] = React.useState(0);
  const handleRefresh = () => {
    setReFresh((pre) => pre + 1);
  };

  const [data, setData] = React.useState<IGroup[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "groups"),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as IGroup);
        setData(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reFresh]);

  return (
    <>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddGroup closeEdit={handleClose} handleRefresh={handleRefresh} />
        </Box>
      </Modal>
      <GroupContainer 
        groupData={data}
        openAddGroup={handleOpen}
      />
    </>
  );
}
