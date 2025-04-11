import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Box, TextField, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Skill from './components/Skill';
import MoneySection from './components/MoneySection';
import theme from './theme/theme';

interface Skill {
  nombre: string;
  clave: string;
  emoji: string;
  xp: number;
  diasGym?: number;
}

function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [dineroTotal, setDineroTotal] = useState(0);
  const [gastoTotal, setGastoTotal] = useState(0);
  const [metaDinero, setMetaDinero] = useState<number | undefined>();

  useEffect(() => {
    // Cargar datos guardados
    const savedSkills = localStorage.getItem('habilidadesRPG');
    if (savedSkills) {
      const parsedSkills = JSON.parse(savedSkills);
      const skillsWithXP = parsedSkills.map((skill: Skill) => ({
        ...skill,
        xp: parseInt(localStorage.getItem(`xp_${skill.clave}`) || '0'),
        diasGym: skill.clave === 'gym' ? cargarDiasGym() : undefined,
      }));
      setSkills(skillsWithXP);
    }

    const mes = obtenerMesActual();
    setDineroTotal(parseFloat(localStorage.getItem(`dinero_${mes}`) || '0'));
    setGastoTotal(parseFloat(localStorage.getItem(`gasto_${mes}`) || '0'));
    setMetaDinero(parseFloat(localStorage.getItem(`meta_dinero_${mes}`) || '0'));
  }, []);

  const obtenerMesActual = () => {
    const ahora = new Date();
    return `${ahora.getFullYear()}_${ahora.getMonth() + 1}`;
  };

  const cargarDiasGym = () => {
    const semanaActual = obtenerSemanaActual();
    return parseInt(localStorage.getItem(`dias_gym_${semanaActual}`) || '0');
  };

  const obtenerSemanaActual = () => {
    const hoy = new Date();
    const primera = new Date(hoy.getFullYear(), 0, 1);
    const dia = Math.floor((hoy.getTime() - primera.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((hoy.getDay() + 1 + dia) / 7);
  };

  const agregarHabilidad = () => {
    if (!newSkillName.trim()) return;

    const clave = newSkillName.toLowerCase().replace(/\s+/g, '_');
    if (skills.find(s => s.clave === clave)) {
      alert('Esa habilidad ya existe.');
      return;
    }

    const nuevaHabilidad: Skill = {
      nombre: newSkillName,
      clave,
      emoji: '✨',
      xp: 0,
    };

    const nuevasHabilidades = [...skills, nuevaHabilidad];
    setSkills(nuevasHabilidades);
    localStorage.setItem('habilidadesRPG', JSON.stringify(nuevasHabilidades));
    setNewSkillName('');
  };

  const sumarXP = (clave: string) => {
    const nuevasHabilidades = skills.map(skill => {
      if (skill.clave === clave) {
        const nuevoXP = skill.xp + 1;
        localStorage.setItem(`xp_${clave}`, nuevoXP.toString());
        
        if (clave === 'gym') {
          const semanaActual = obtenerSemanaActual();
          const diasGym = parseInt(localStorage.getItem(`dias_gym_${semanaActual}`) || '0') + 1;
          localStorage.setItem(`dias_gym_${semanaActual}`, diasGym.toString());
          return { ...skill, xp: nuevoXP, diasGym };
        }
        
        return { ...skill, xp: nuevoXP };
      }
      return skill;
    });
    setSkills(nuevasHabilidades);
  };

  const reiniciarXP = (clave: string) => {
    if (window.confirm('¿Seguro que quieres reiniciar esta habilidad?')) {
      localStorage.setItem(`xp_${clave}`, '0');
      const nuevasHabilidades = skills.map(skill =>
        skill.clave === clave ? { ...skill, xp: 0 } : skill
      );
      setSkills(nuevasHabilidades);
    }
  };

  const eliminarHabilidad = (clave: string) => {
    if (window.confirm('¿Eliminar esta habilidad?')) {
      localStorage.removeItem(`xp_${clave}`);
      const nuevasHabilidades = skills.filter(s => s.clave !== clave);
      setSkills(nuevasHabilidades);
      localStorage.setItem('habilidadesRPG', JSON.stringify(nuevasHabilidades));
    }
  };

  const cambiarEmoji = (clave: string, nuevoEmoji: string) => {
    const nuevasHabilidades = skills.map(skill =>
      skill.clave === clave ? { ...skill, emoji: nuevoEmoji } : skill
    );
    setSkills(nuevasHabilidades);
    localStorage.setItem('habilidadesRPG', JSON.stringify(nuevasHabilidades));
  };

  const handleNewSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewSkillName(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Box sx={{
            background: '#2b2b2b',
            border: '4px solid #00ffcc',
            borderRadius: '10px',
            padding: 2,
            marginBottom: 3,
            boxShadow: '0 0 8px #00ffcc'
          }}>
            <TextField
              fullWidth
              value={newSkillName}
              onChange={handleNewSkillChange}
              placeholder="Nombre habilidad"
              sx={{
                mb: 2,
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
              fullWidth
              variant="contained"
              onClick={agregarHabilidad}
              sx={{
                backgroundColor: '#00ffcc',
                color: '#1b1b1b',
                '&:hover': {
                  backgroundColor: '#00ffaa',
                },
              }}
            >
              AGREGAR HABILIDAD
            </Button>
          </Box>

          {skills.map((skill) => (
            <Skill
              key={skill.clave}
              name={skill.nombre}
              emoji={skill.emoji}
              xp={skill.xp}
              onAddXP={() => sumarXP(skill.clave)}
              onReset={() => reiniciarXP(skill.clave)}
              onDelete={() => eliminarHabilidad(skill.clave)}
              onEmojiChange={(newEmoji) => cambiarEmoji(skill.clave, newEmoji)}
              daysGym={skill.diasGym}
            />
          ))}

          <MoneySection
            title="DINERO GANADO ESTE MES"
            emoji="💰"
            total={dineroTotal}
            onAdd={(amount) => {
              const mes = obtenerMesActual();
              const nuevo = dineroTotal + amount;
              setDineroTotal(nuevo);
              localStorage.setItem(`dinero_${mes}`, nuevo.toString());
            }}
            onReset={() => {
              if (window.confirm('¿Seguro que quieres reiniciar el dinero de este mes?')) {
                const mes = obtenerMesActual();
                setDineroTotal(0);
                localStorage.setItem(`dinero_${mes}`, '0');
              }
            }}
            showGoal
            goal={metaDinero}
            onGoalChange={(goal) => {
              const mes = obtenerMesActual();
              setMetaDinero(goal);
              localStorage.setItem(`meta_dinero_${mes}`, goal.toString());
            }}
          />

          <MoneySection
            title="DINERO GASTADO ESTE MES"
            emoji="💸"
            total={gastoTotal}
            onAdd={(amount) => {
              const mes = obtenerMesActual();
              const nuevo = gastoTotal + amount;
              setGastoTotal(nuevo);
              localStorage.setItem(`gasto_${mes}`, nuevo.toString());
            }}
            onReset={() => {
              if (window.confirm('¿Seguro que quieres reiniciar el gasto de este mes?')) {
                const mes = obtenerMesActual();
                setGastoTotal(0);
                localStorage.setItem(`gasto_${mes}`, '0');
              }
            }}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
