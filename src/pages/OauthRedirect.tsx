import { useEffect } from 'react';
import axios from 'axios';
import { IUserLocalStorage, IUserReturnFromToken } from '../interface/User';
import { useNavigate } from 'react-router-dom';
import { doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import { dbFireStore } from "../config/firebase";

export default function OAuthRedirect() {
    const navigate = useNavigate();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const accessToken = urlParams.get('access_token');

    useEffect(() => {
        const fetchData = async () => {
            const requestData = {
                code: code,
                redirect_uri: 'https://www.cmuexplore.com/callback',
                client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
                client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
                grant_type: 'authorization_code',
            };

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            axios
                .post('https://oauth.cmu.ac.th/v1/GetToken.aspx', requestData, { headers })
                .then((response) => {
                    console.log('Response:', response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };

        fetchData();
    }, [code]);

    useEffect(() => {
        if (accessToken) {
            const accessData = async () => {
                axios.request({
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    method: "GET",
                    url: 'https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo'
                }).then(response => {
                    console.log(response.data);
                    const userData = response.data.map((user: IUserLocalStorage) => ({
                        uid: user.student_id,
                        firstName: user.firstname_EN,
                        lastName: user.lastname_EN
                    }));
                    handleStoreUserInfo(response.data);
                    localStorage.setItem("user", JSON.stringify(userData));
                }).catch(error => {
                    console.error("An error occurred:", error);
                }).finally(() => {
                    navigate("/");
                });
            };
            accessData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

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
        const user: IUserReturnFromToken = docUser;
        try {

            if (docUser) {
                handleActiveUser(docUser.student_id ?? "");
                navigate("/");
            } else {
                const newUser = {
                    uid: user.student_id,
                    email: user.cmuitaccount,
                    firstName: user.firstname_EN,
                    lastName: user.lastname_EN,
                    faculty: user.organization_name_EN,
                    friendList: [],
                    posts: [],
                    userRole: "user",
                    isActive: true,
                    createdAt: new Date().toLocaleString(),
                    profilePhoto: 'images/logoCmu.png',
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
        <div style={{ color: "black" }}>OAuthRedirect</div>
    );
}
