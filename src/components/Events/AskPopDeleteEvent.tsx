import { Box, Button } from "@mui/material";
import { styleBoxReport } from "../../utils/styleBox";

interface IFunction {
    handleCloseAsk: () => void;
    handleDelete: (id: string) => void;
    eventId: string;
}

export default function AskPopDeleteEvent(props: IFunction) {

    return (
        <Box sx={styleBoxReport}>
            <Box sx={{ display: "flex", mb: 1 }}>
                <Box
                    id="modal-modal-title"
                    sx={{ fontSize: "25px", fontWeight: "500", color: "black" }}
                >
                    Are you sure?
                </Box>
            </Box>
            <Box
                sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
            >
                <Button
                    sx={{
                        backgroundColor: "grey",
                        color: "white",
                        "&:hover": {
                            color: "black",
                            backgroundColor: "#E1E1E1",
                        },
                    }}
                    onClick={props.handleCloseAsk}
                >
                    Cancel
                </Button>
                <Button
                    sx={{
                        backgroundColor: "#8E51E2",
                        color: "white",
                        "&:hover": {
                            color: "black",
                            backgroundColor: "#E1E1E1",
                        },
                    }}
                    onClick={() => props.handleDelete(props.eventId)}
                >
                    Confirm
                </Button>
            </Box>
        </Box>
    );
}
