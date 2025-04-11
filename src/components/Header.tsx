import React from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)`
  background-color: #2b2b2b;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 1100;
`;

const Header = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontFamily: '"Press Start 2P", cursive' }}>
          🎮 MI VIDA RPG - PIXEL MODE
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 