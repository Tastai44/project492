import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export default function EachTopic() {
  return (
    <div>
        <nav aria-label="main mailbox folders">
          <List sx={{color:"black"}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
                {/* <MoreHorizIcon /> */}
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
    </div>
  )
}
