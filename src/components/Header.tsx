import React from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)`
  background-color: #2b2b2b;
  margin-bottom: 20px;
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