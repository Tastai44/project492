// import * as React from 'react'
import { Box, Button, TextField } from "@mui/material";
import { styleBox } from "../../utils/styleBox";

interface IFunction {
  handleCloseReport: () => void;
}

export default function ReportCard(props: IFunction) {
  return (
    <Box sx={styleBox}>
      <Box sx={{ display: "flex", mb:1 }}>
        <Box
          id="modal-modal-title"
          sx={{ fontSize: "25px", fontWeight: "500", color: "black" }}
        >
          Report
        </Box>
      </Box>
      <TextField
        id="outlined-basic"
        label="Reasons"
        variant="outlined"
        multiline
        maxRows={3}
        sx={{ width: "100%" }}
      />
      <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt:2 }}
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
            onClick={props.handleCloseReport}
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
            type="submit"
          >
            Save
          </Button>
        </Box>
    </Box>
  );
}
