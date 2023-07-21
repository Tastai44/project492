import * as React from "react";
import Grid from "@mui/material/Grid";
import MemberCard from "./MemberCard";
import { User } from "../../interface/User";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { dbFireStore } from "../../config/firebase";
export default function MembersCon() {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
const [users, setUsers] = React.useState<User[]>([]);
React.useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(dbFireStore, "users"),
          where("uid", "!=", userInfo.uid),
          orderBy("uid"),
          orderBy("firstName", "desc")
        );
        const querySnapshot = await getDocs(q);
        const queriedData = querySnapshot.docs.map((doc) => doc.data() as User);
        setUsers(queriedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  },[userInfo.uid])

  return (
    <Grid sx={{ flexGrow: 1, gap:"30px" }} container>
      {users.map((u) => (
          <MemberCard 
            key={u.uid}
            username={`${u.firstName} ${u.lastName}`}
            profilePhoto={u.profilePhoto ? u.profilePhoto : ""}
            uId={u.uid}
          />
      ))}
    </Grid>
  );
}
