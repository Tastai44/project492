import { Modal, Box, Autocomplete, TextField, Divider, Typography, IconButton, Button } from '@mui/material';
import { styleTable } from '../../utils/styleBox';
import { locations } from '../../helper/CMULocations';
import { ChangeEvent } from 'react';
import CancelIcon from "@mui/icons-material/Cancel";

interface IData {
    openLocation: boolean;
    location: string;
    handleCloseLocation: () => void;
    handletSaveLocation: () => void;
    handleChangeLocation: (_event: ChangeEvent<unknown>,
        newValue: string | null) => void;
}

export default function LocationCard(props: IData) {

    return (
        <Modal
            open={props.openLocation}
            onClose={props.handleCloseLocation}
        >
            <Box sx={styleTable}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={props.handleCloseLocation}>
                        <CancelIcon />
                    </IconButton>
                </Box>
                <Typography id="modal-modal-title" variant="h5" sx={{ color: "black" }}>
                    Choose location
                </Typography>
                <Divider sx={{ background: "grey" }} />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={locations}
                    value={props.location}
                    onChange={props.handleChangeLocation}
                    isOptionEqualToValue={(option, value) => option === value}
                    sx={{ width: "100%", mt: 2 }}
                    renderInput={(params) => <TextField {...params} label="Locations" />}
                />
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
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
                        onClick={props.handleCloseLocation}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={props.handletSaveLocation}
                        sx={{
                            backgroundColor: "#8E51E2",
                            color: "white",
                            "&:hover": {
                                color: "black",
                                backgroundColor: "#E1E1E1",
                            },
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
