import * as React from "react";
import Grid from "@mui/material/Grid";
import MemberCard from "./MemberCard";
import { User } from "../../interface/User";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
export default function MembersCon() {
const [users, setUsers] = React.useState<User[]>([]);
React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          orderBy("createAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as User);
        setUsers(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  },[])

  return (
    <Grid sx={{ flexGrow: 1, gap:"30px" }} container>
      {users.map((u) => (
          <MemberCard 
            key={u.uid}
            members={u}
          />
      ))}
    </Grid>
  );
}
