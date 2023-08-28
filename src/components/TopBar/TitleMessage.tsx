import { Box } from "@mui/material";

export default function TitleMessage() {
    return (
        <Box
            sx={{
                fontSize: "20px",
                padding: "5px",
                fontWeight: "bold",
                color: "black",
                margin: 2,
                width: "300px",
                borderRadius: "10px",
                "&:hover": {
                    color: "black",
                    backgroundColor: "transparent",
                },
            }}
        >
            {"Messages"}
        </Box>
    );
}
