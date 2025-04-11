import React from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface SkillProps {
  name: string;
  emoji: string;
  xp: number;
  onAddXP: () => void;
  onReset: () => void;
  onDelete: () => void;
  onEmojiChange: (newEmoji: string) => void;
  daysGym?: number;
}

const SkillContainer = styled(Box)`
  background: #2b2b2b;
  border: 4px solid #00ffcc;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 0 8px #00ffcc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const DeleteButton = styled('span')`
  position: absolute;
  top: 5px;
  right: 8px;
  font-size: 12px;
  color: #ff6666;
  cursor: pointer;
  &:hover {
    color: #ff3333;
  }
`;

const Skill = ({
  name,
  emoji,
  xp,
  onAddXP,
  onReset,
  onDelete,
  onEmojiChange,
  daysGym
}: SkillProps) => {
  const level = Math.floor(xp / 50) + 1;
  const remaining = xp % 50;
  const progress = (remaining / 50) * 100;

  const handleEmojiClick = () => {
    const newEmoji = prompt('🎭 Ingresa un nuevo emoji:');
    if (newEmoji) {
      onEmojiChange(newEmoji);
    }
  };

  return (
    <SkillContainer>
      <DeleteButton onClick={onDelete}>❌</DeleteButton>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            component="span"
            sx={{ cursor: 'pointer' }}
            onClick={handleEmojiClick}
          >
            {emoji}
          </Typography>
          <Typography component="strong">{name}</Typography>
        </Box>
        <Typography>
          Nivel: {level} | XP: {xp} / {(level - 1) * 50 + 50}
        </Typography>
        {daysGym !== undefined && (
          <Typography>Días esta semana: {daysGym}</Typography>
        )}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mt: 1,
            height: 10,
            backgroundColor: '#444',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#00ffcc'
            }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={onAddXP}
          sx={{
            backgroundColor: '#00ffcc',
            color: '#1b1b1b',
            '&:hover': {
              backgroundColor: '#00ffaa'
            }
          }}
        >
          +1
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={onReset}
          sx={{
            backgroundColor: '#00ffcc',
            color: '#1b1b1b',
            '&:hover': {
              backgroundColor: '#00ffaa'
            }
          }}
        >
          🧹
        </Button>
      </Box>
    </SkillContainer>
  );
};

export default Skill; 