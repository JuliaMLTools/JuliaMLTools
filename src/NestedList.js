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
import NestedListItem from './NestedListItem';

export default function NestedList() {

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav">
            <NestedListItem category="Examples" links={[{title:"ShakespeareGPT", href:"/shakespeare-gpt"}]} />
            <NestedListItem category="Packages" links={[
                {title:"TransformerBlocks.jl", href:"/transformer-blocks"},
                {title:"GraphNets.jl", href:"/graph-nets"},
            ]} />
        </List>
    );

}