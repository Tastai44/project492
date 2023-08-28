import { themeApp } from "./Theme";

export const styleCreatePost = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  color: "black",
  p: 4,
};

export const styleBoxPop = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  color: "black",
  p: 4,
  overflow: "auto",
};

export const styleBoxChat = {
  position: "fixed",
  left: 10,
  bottom: 0,
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 350,
  },
  height: 480,
  backgroundColor: "background.paper",
  color: "black",
  zIndex: 9999,
};

export const stylePreviewPhoto = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  color: "black",
  overflow: "auto",
};

export const styleBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "auto",
  p: 4,
};

export const styleTable = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

export const styleSearchBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  color: "black",
  p: 2,
};

export const styleBoxEmoji = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  color: "black",
  p: 3,
  overflowY: "scroll",
  height: 400,
};

export const styleBoxReport = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "auto",
  p: 4,
};

export const styleCommentBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "background.paper",
  color: "black",
  p: 3,
  overflow: "auto",
};

export const styleChatList = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "background.paper",
  color: "black",
};