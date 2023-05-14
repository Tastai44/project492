import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export default function EachGroup() {
  return (
    <div>
        <nav aria-label="main mailbox folders">
          <List sx={{color:"black"}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                <ListItemText primary="ISNE" />
                <MoreHorizIcon />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
    </div>
  )
}
