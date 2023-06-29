import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";

interface IData {
  hashTag: string;
}

export default function EachTopic({hashTag} : IData) {
  return (
    <div>
        <nav aria-label="main mailbox folders">
          <List sx={{color:"black"}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                <ListItemText primary={`${hashTag}`} />
                {/* <MoreHorizIcon /> */}
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
    </div>
  )
}
