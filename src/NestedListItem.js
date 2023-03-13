import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

export default function NestedListItem({category,links}){
    const [open, setOpen] = React.useState(true);
    const handleClick = () => { setOpen(!open) };

    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={category} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {links.map(({title,href}) => (
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} component="a" href={href}>
                        <ListItemText primary={title} />
                    </ListItemButton>
                </List>
                ))}
            </Collapse>
        </>
    )
}