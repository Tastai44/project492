import { useMemo, useState } from 'react';
import { IUserReturnFromToken } from '../interface/User';
import { useNavigate } from 'react-router-dom';
import { doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import { dbFireStore } from "../config/firebase";
import Loading from '../components/Loading';
import { getUserInfo, requestAccessToken } from '../api/AccessToken';

export default function OAuthRedirect() {
    const navigate = useNavigate();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const [openLoading, setOpenLoading] = useState(false);

    useMemo(() => {
        setOpenLoading(true);
        const fetchData = async () => {
            if (code) {
                const accessToken = await requestAccessToken(code);
                console.log(accessToken);
                if (accessToken) {
                    const userInfo = await getUserInfo(accessToken.access_token);
                    console.log(userInfo);
                    const userData = {
                        uid: userInfo.student_id,
                        firstName: userInfo.firstname_EN,
                        lastName: userInfo.lastname_EN
                    };
                    localStorage.setItem("user", JSON.stringify(userData));
                    handleStoreUserInfo(userInfo);
                }
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleActiveUser = async (userId: string) => {
        try {
            const q = query(
                collection(dbFireStore, "users"),
                where("uid", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const doc = querySnapshot.docs[0];

            if (doc.exists()) {
                await updateDoc(doc.ref, { isActive: true });
            } else {
                console.log("Profile does not exist");
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    const handleStoreUserInfo = async (docUser: IUserReturnFromToken) => {
        const userCollection = collection(dbFireStore, "users");

        try {
            const q = query(
                collection(dbFireStore, "users"),
                where("uid", "==", docUser.student_id)
            );

            const querySnapshot = await getDocs(q);
            const userData = querySnapshot.docs[0];

            if (userData) {
                await handleActiveUser(docUser.student_id ?? "");
                navigate("/");
            } else {
                const newUser = {
                    uid: docUser.student_id,
                    email: docUser.cmuitaccount,
                    firstName: docUser.firstname_EN,
                    lastName: docUser.lastname_EN,
                    faculty: docUser.organization_name_EN,
                    friendList: [],
                    posts: [],
                    userRole: "user",
                    isActive: true,
                    createdAt: new Date().toLocaleString(),
                    profilePhoto: '',
                    year: 0
                };
                const docRef = doc(userCollection);
                await setDoc(docRef, newUser);
                navigate("/");
            }

        } catch (error) {
            console.error("Error login user:", error);
        }
    };

    return (
        <div style={{ color: "black" }}>
            <Loading
                openLoading={openLoading}
            />
        </div>
    );
}
