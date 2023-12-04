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
  color: "black",
  borderRadius: "10px",
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
  borderRadius: "10px",
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
  borderRadius: "10px",
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
  maxHeight: 600,
  bgcolor: "background.paper",
  overflow: "auto",
  p: 4,
  borderRadius: "10px",
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
  borderRadius: "10px",
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
  borderRadius: "10px",
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
  borderRadius: "10px",
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
  borderRadius: "10px",
  boxShadow: 24,
  overflow: "auto",
  bgcolor: "background.paper",
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
  borderRadius: "10px",
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

export const styleEditProfile = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "background.paper",
  borderRadius: "10px",
  p: 4,
};

export const stylePrivacyBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 500,
  transform: "translate(-50%, -50%)",
  [themeApp.breakpoints.down("md")]: {
    width: 300,
  },
  bgcolor: "white",
  borderRadius: "10px",
  p: 4,
};

export const styleLoading = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  "&:focus": {
    outline: "none",
  },
  "&:active": {
    boxShadow: "none",
  },
  textAlign: "center",
};