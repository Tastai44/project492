import { Box, Paper } from "@mui/material";

interface IData {
	details: string;
}

export default function AboutGroup({ details }: IData) {
	return (
		<div>
			<Paper sx={{ display: { xs: "none", md: "block" } }}>
				<Box
					sx={{
						fontSize: "20px",
						textAlign: "center",
						padding: "5px",
						fontWeight: "bold",
					}}
				>
					About The Group
				</Box>
				<Box
					sx={{
						textAlign: "left",
						padding: "10px",
						color: "#727272",
					}}
				>
					{details}
				</Box>
			</Paper>
		</div>
	);
}
