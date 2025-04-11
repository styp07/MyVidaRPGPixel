import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCalendar = styled(Calendar)`
  width: 100%;
  border: none;
  .react-calendar__tile--active {
    background: #00ffcc !important;
    color: #1b1b1b !important;
  }
`;

const CalendarComponent = () => {
  const [festivos, setFestivos] = useState<Date[]>([]);

  useEffect(() => {
    const obtenerFestivos = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v2/PublicHolidays/2023/CO');
        const data = await response.json();
        const fechasFestivos = data.map((festivo: any) => new Date(festivo.date));
        setFestivos(fechasFestivos);
      } catch (error) {
        console.error('Error al obtener los festivos:', error);
      }
    };
    obtenerFestivos();
  }, []);

  const tileClassName = ({ date }: { date: Date }) => {
    return festivos.some(festivo => festivo.toDateString() === date.toDateString())
      ? 'react-calendar__tile--active'
      : null;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ color: '#ffff66', mb: 2 }}>
        📅 Calendario de Metas
      </Typography>
      <StyledCalendar
        locale="es"
        tileClassName={tileClassName}
      />
    </Box>
  );
};

export default CalendarComponent; 