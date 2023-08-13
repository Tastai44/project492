import { Box, Modal } from "@mui/material";

interface IData {
    openSearchBar: boolean;
    handleCloseSearchBar: () => void;
}
export default function SearchContent(props: IData) {
    return (
        <Modal
            open={props.openSearchBar}
            onClose={props.handleCloseSearchBar}
        >
            <Box>
                Search
            </Box>
        </Modal>
    );
}
