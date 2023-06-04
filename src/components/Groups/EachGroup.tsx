import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
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
                {/* <BorderColorIcon />
                <DeleteIcon /> */}
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
    </div>
  )
}
