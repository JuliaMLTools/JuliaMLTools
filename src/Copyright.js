import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
      <>
      
      <br/>
    <Typography variant="body2" color="text.secondary" align="center">
      <MuiLink color="inherit" href="https://twitter.com/JuliaMLTools">
        @JuliaMLTools
      </MuiLink>
    </Typography>
    </>
  );
}
