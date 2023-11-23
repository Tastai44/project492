import { useEffect, useState } from 'react';
import { IUserLocalStorage, IUserReturnFromToken } from '../interface/User';
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
    // const accessToken = urlParams.get('access_token');
    // const [accessToken, setAccessToken] = useState('');
    const [openLoading, setOpenLoading] = useState(false);

    useEffect(() => {
        setOpenLoading(true);
        // const fetchData = async () => {
        //     const requestData = {
        //         code: code,
        //         redirect_uri: 'https://www.cmuexplore.com/callback',
        //         client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
        //         client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
        //         grant_type: 'authorization_code',
        //     };

        //     const headers = {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     };

        //     axios
        //         .post('https://oauth.cmu.ac.th/v1/GetToken.aspx', requestData, { headers })
        //         .then((response) => {
        //             console.log('Response:', response.data);
        //             setAccessToken(response.data.access_token);
        //         })
        //         .catch((error) => {
        //             console.error('Error:', error);
        //         });
        // };

        // fetchData();
        const fetchData = async () => {
            if (code) {
                const accessToken = await requestAccessToken(code);
                console.log(accessToken);
                if (accessToken) {
                    const userInfo = await getUserInfo(accessToken);
                    const userData = userInfo.map((user: IUserLocalStorage) => ({
                        uid: user.student_id,
                        firstName: user.firstname_EN,
                        lastName: user.lastname_EN
                    }));
                    handleStoreUserInfo(userInfo);
                    localStorage.setItem("user", JSON.stringify(userData));
                    navigate("/");
                    setOpenLoading(false);
                }
            }
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    // useEffect(() => {
    //     if (accessToken) {
    //         const accessData = async () => {
    //             axios.request({
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`
    //                 },
    //                 method: "GET",
    //                 url: 'https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo'
    //             }).then(response => {
    //                 console.log(response.data);
    //                 const userData = response.data.map((user: IUserLocalStorage) => ({
    //                     uid: user.student_id,
    //                     firstName: user.firstname_EN,
    //                     lastName: user.lastname_EN
    //                 }));
    //                 handleStoreUserInfo(response.data);
    //                 localStorage.setItem("user", JSON.stringify(userData));
    //             }).catch(error => {
    //                 console.error("An error occurred:", error);
    //             }).finally(() => {
    //                 navigate("/");
    //                 setOpenLoading(false);
    //             });
    //         };
    //         accessData();
    //     }
    // }, [accessToken]);

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
                    profilePhoto: '',
                    year: 0
                };
                const docRef = doc(userCollection);
                await setDoc(docRef, newUser);
                // navigate("/");
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
