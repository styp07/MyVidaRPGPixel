import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MoneySectionProps {
  title: string;
  emoji: string;
  total: number;
  onAdd: (amount: number) => void;
  onReset: () => void;
  showGoal?: boolean;
  goal?: number;
  onGoalChange?: (goal: number) => void;
}

const Container = styled(Box)`
  background: #2b2b2b;
  border: 4px solid #00ffcc;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 0 8px #00ffcc;
`;

const MoneySection = ({
  title,
  emoji,
  total,
  onAdd,
  onReset,
  showGoal = false,
  goal,
  onGoalChange
}: MoneySectionProps) => {
  const [amount, setAmount] = useState<string>('');

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      onAdd(value);
      setAmount('');
    }
  };

  const getGoalStatus = () => {
    if (!goal) return null;
    if (total >= goal) {
      return (
        <Typography sx={{ color: '#66ff66', mt: 1 }}>
          🎉 ¡Meta alcanzada o superada!
        </Typography>
      );
    }
    return (
      <Typography sx={{ color: '#ffff66', mt: 1 }}>
        Progreso: ${total.toFixed(2)} / ${goal.toFixed(2)}
      </Typography>
    );
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ color: '#ffff66', mb: 2 }}>
        {emoji} {title}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Cantidad"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#00ffcc',
              '& fieldset': {
                borderColor: '#00ffcc',
              },
              '&:hover fieldset': {
                borderColor: '#00ffaa',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: '#00ffcc',
            color: '#1b1b1b',
            '&:hover': {
              backgroundColor: '#00ffaa',
            },
          }}
        >
          ➕ Sumar
        </Button>
        <Button
          variant="contained"
          onClick={onReset}
          sx={{
            backgroundColor: '#00ffcc',
            color: '#1b1b1b',
            '&:hover': {
              backgroundColor: '#00ffaa',
            },
          }}
        >
          🧹 Reiniciar
        </Button>
      </Box>

      {showGoal && (
        <Box sx={{ mb: 2 }}>
          <TextField
            type="number"
            label="Meta"
            value={goal || ''}
            onChange={(e) => onGoalChange?.(parseFloat(e.target.value))}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#00ffcc',
                '& fieldset': {
                  borderColor: '#00ffcc',
                },
                '&:hover fieldset': {
                  borderColor: '#00ffaa',
                },
              },
            }}
          />
        </Box>
      )}

      <Typography variant="h6" sx={{ color: '#00ffcc' }}>
        Total: ${total.toFixed(2)}
      </Typography>

      {showGoal && getGoalStatus()}
    </Container>
  );
};

export default MoneySection; 