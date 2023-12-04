import { Modal, Box, IconButton, Card, CardMedia, Button } from "@mui/material";
import { stylePreviewPhoto } from "../../utils/styleBox";
import CancelIcon from "@mui/icons-material/Cancel";

interface IData {
    openPre: boolean;
    previewImages: string;
    handleClearImage: () => void;
    handleClosePre: () => void;
    handleUpload: () => void;
}

export default function UploadProfile(props: IData) {
    return (
        <Modal
            open={props.openPre}
            onClose={props.handleClosePre}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={stylePreviewPhoto}>
                {props.previewImages !== null && (
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <IconButton onClick={props.handleClearImage}>
                                <CancelIcon sx={{ color: "black" }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Card sx={{ width: "50%", height: "auto" }}>
                                <CardMedia
                                    component="img"
                                    image={props.previewImages}
                                    alt="Paella dish"
                                />
                            </Card>
                        </Box>
                    </Box>
                )}
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1, m: 1 }}
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
                        onClick={props.handleClosePre}
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
                        onClick={props.handleUpload}
                        type="submit"
                    >
                        Upload
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
