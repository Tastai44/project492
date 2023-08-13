import { useState, ChangeEvent } from "react";
import { Button, Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import EventContainer from "../../components/Events/EventContainer";
import AddEvent from "../../components/Events/AddEvent";
import SearchBar from "../../helper/SearchBar";

const Item = styled(Box)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

export default function Events() {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [searchValue, setValue] = useState("");
	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setValue(value);
	};
	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box>
					<AddEvent
						closeAdd={handleClose}
					/>
				</Box>
			</Modal>
			<Box sx={{ width: "100%", marginTop: 7 }}>
				<Stack spacing={2}>
					<Item
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography
							sx={{ fontSize: "30px", color: "#920EFA", fontWeight: 500 }}
						>
							CMU Events
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<SearchBar
								searchValue={searchValue}
								handleSearch={handleSearch}
							/>
							<Button
								sx={{
									fontSize: "16px",
									"&:hover": { backgroundColor: "white", color: "black" },
									borderRadius: "10px",
									backgroundColor: "#A020F0",
									padding: "5px",
									color: "#fff",
								}}
								onClick={handleOpen}
							>
								Add an event
							</Button>
						</Box>

					</Item>
					<Item sx={{ display: "flex", justifyContent: "center" }}>
						<EventContainer
							searchValue={searchValue}
						/>
					</Item>
				</Stack>
			</Box>
		</>
	);
}
