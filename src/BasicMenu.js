import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider, Link } from '@mui/material';

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        onClick={handleClick}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        ML
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open} 
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
            component={Link}
            href="/multipoints">MultipointEval
        </MenuItem>
        <MenuItem onClick={handleClose}>Nameplate2ModelNum</MenuItem>
        <MenuItem
            component={Link}
            href="/model2configs">Model2Config
        </MenuItem>
        <Divider />
        <MenuItem
            component={Link}
            href="/model2vecs">Model2Vec
        </MenuItem>
        <MenuItem
            component={Link}
            href="/reading2vecs">Reading2Vec
        </MenuItem>
        <MenuItem
            component={Link}
            href="/reading2evalactions">Reading2EvalAction
        </MenuItem>
      </Menu>
    </>
  );
}