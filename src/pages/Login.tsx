import {
	Box,
	Button,
	CardMedia,
	Grid,
	Paper,
	TextField,
	styled,
} from "@mui/material";
import * as React from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, dbFireStore } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import community from "/images/communityPic.png";

import "firebase/database";
import { doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import { themeApp } from "../utils/Theme";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
	height: "600px",
}));

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	// const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
	//     e.preventDefault();
	//     try {
	//       await createUserWithEmailAndPassword(auth, email, password);
	//       console.log("User created successfully!");
	//     } catch (error) {
	//       console.error("Error creating user:", error);
	//     }
	//   };
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
	const handleSignIn = async () => {
		const userCollection = collection(dbFireStore, "users");
		try {
			await signInWithEmailAndPassword(auth, email, password);
			const user = auth.currentUser;
			localStorage.setItem("user", JSON.stringify(user));
			const q = query(
				collection(dbFireStore, "users"),
				where("uid", "==", user?.uid)
			);
			const querySnapshot = await getDocs(q);
			const docUser = querySnapshot.docs[0];

			if (docUser) {
				handleActiveUser(user?.uid ?? "");
				navigate("/");
			} else {
				const newUser = {
					uid: user?.uid,
					email: user?.email,
					friendList: [],
					posts: [],
					userRole: "user",
					isActive: true,
					createdAt: new Date().toLocaleString(),
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
		// <Box sx={{ mt: 8 }}>
		//   <TextField
		//     id="email"
		//     label="Email"
		//     variant="outlined"
		//     type="email"
		//     value={email}
		//     onChange={(e) => setEmail(e.target.value)}
		//   />
		//   <TextField
		//     id="password"
		//     label="Password"
		//     variant="outlined"
		//     type="password"
		//     value={password}
		//     onChange={(e) => setPassword(e.target.value)}
		//   />
		//   <Button onClick={handleSignIn}>Sign In</Button>
		// </Box>
		<Box sx={{
			flexGrow: 1, mt: 8,
			[themeApp.breakpoints.down("lg")]: {
				mt: 2
			}
		}}>
			<Grid container spacing={1} sx={{
				[themeApp.breakpoints.down("lg")]: {
					flexDirection: "column"
				}
			}}>
				<Grid item xs={12} md={6}>
					<Item>
						<Box sx={{ fontSize: "25px" }}>
							WELCOME <br />
							TO <br />
							CMU <br />
							COMMUNITY
						</Box>
						<CardMedia
							sizes="medium"
							component="img"
							width={"100%"}
							height={"70%"}
							image={community}
							alt="Paella dish"
						/>
					</Item>
				</Grid>
				<Grid item xs={12} md={6}>
					<Item>
						<Box
							sx={{
								mt: "20%",
								display: "flex",
								flexDirection: "column",
								gap: 1,
							}}
						>
							<Box sx={{ fontSize: "40px", mb: 5 }}>Log in</Box>
							<TextField
								required
								id="email"
								label="Email"
								variant="outlined"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<TextField
								required
								id="password"
								label="Password"
								variant="outlined"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button
								size="small"
								sx={{
									display: "flex",
									width: "50px",
									backgroundColor: "primary.main",
									color: "white",
									"&:hover": {
										background: "primary.contrastText",
										color: "black",
									},
								}}
								onClick={handleSignIn}
							>
								Sign In
							</Button>
						</Box>
					</Item>
				</Grid>
			</Grid>
		</Box>
	);
}
