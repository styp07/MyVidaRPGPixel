import React, { useState, useEffect, ChangeEvent } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
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
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [mainSkills, setMainSkills] = useState<Skill[]>([]);
  const [currentGif, setCurrentGif] = useState<string>('assets/gifs/Fase1.gif');
  const [nivelPersonaje, setNivelPersonaje] = useState<number>(1);

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

  useEffect(() => {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }
  }, []);

  useEffect(() => {
    if (!userName && !localStorage.getItem('userName')) {
      const name = prompt('Ingresa tu nombre:');
      if (name) {
        setUserName(name);
        localStorage.setItem('userName', name);
        const skill1 = prompt('Ingresa la primera habilidad principal:');
        const skill2 = prompt('Ingresa la segunda habilidad principal:');
        if (skill1 && skill2) {
          const initialSkills = [
            { nombre: skill1, clave: skill1.toLowerCase(), emoji: '✨', xp: 0 },
            { nombre: skill2, clave: skill2.toLowerCase(), emoji: '✨', xp: 0 }
          ];
          setMainSkills(initialSkills);
          setSkills(initialSkills);
          localStorage.setItem('habilidadesRPG', JSON.stringify(initialSkills));
        }
      }
    } else if (!userName) {
      setUserName(localStorage.getItem('userName'));
    }
  }, []);

  useEffect(() => {
    const checkLevel = () => {
      const nivelesHabilidades = mainSkills.map(skill => Math.floor(skill.xp / 50) + 1);
      const nivelMinimo = Math.min(...nivelesHabilidades);
      setNivelPersonaje(nivelMinimo);
      
      console.log('Nivel personaje:', nivelMinimo); // Para debug
      if (nivelMinimo >= 8) {
        setCurrentGif('assets/gifs/Fase8.gif');
      } else if (nivelMinimo >= 7) {
        setCurrentGif('assets/gifs/Fase7.gif');
      } else if (nivelMinimo >= 6) {
        setCurrentGif('assets/gifs/Fase6.gif');
      } else if (nivelMinimo >= 5) {
        setCurrentGif('assets/gifs/Fase5.jpg');
      } else if (nivelMinimo >= 4) {
        setCurrentGif('assets/gifs/Fase4.gif');
      } else if (nivelMinimo >= 3) {
        setCurrentGif('assets/gifs/Fase3.gif');
      } else if (nivelMinimo >= 2) {
        setCurrentGif('assets/gifs/Fase2.gif');
      } else {
        setCurrentGif('assets/gifs/Fase1.gif');
      }
    };
    checkLevel();
  }, [mainSkills]);

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
          if (diasGym >= 20) {
            alert('💪 ¡20 días de gym alcanzados este mes! Reiniciando.');
            localStorage.setItem(`dias_gym_${semanaActual}`, '0');
            return { ...skill, xp: nuevoXP, diasGym: 0 };
          }
          localStorage.setItem(`dias_gym_${semanaActual}`, diasGym.toString());
          return { ...skill, xp: nuevoXP, diasGym };
        }
        
        return { ...skill, xp: nuevoXP };
      }
      return skill;
    });
    setSkills(nuevasHabilidades);
    
    // Actualizar mainSkills si la habilidad modificada es una habilidad principal
    const mainSkillIndex = mainSkills.findIndex(skill => skill.clave === clave);
    if (mainSkillIndex !== -1) {
      const nuevasMainSkills = [...mainSkills];
      nuevasMainSkills[mainSkillIndex] = {
        ...nuevasMainSkills[mainSkillIndex],
        xp: nuevasHabilidades.find(s => s.clave === clave)?.xp || 0
      };
      setMainSkills(nuevasMainSkills);
    }
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

  const reiniciarTodo = () => {
    if (window.confirm('¿Seguro que quieres reiniciar todos los datos?')) {
      localStorage.clear();
      setSkills([]);
      setDineroTotal(0);
      setGastoTotal(0);
      setMetaDinero(undefined);
      setBackgroundImage(null);
    }
  };

  const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBackgroundImage(result);
        localStorage.setItem('backgroundImage', result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth={false} sx={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: '64px',
      }}>
        <Box sx={{
          mb: 4,
          p: 2,
          backgroundColor: backgroundImage ? 'rgba(43, 43, 43, 0.8)' : '#1b1b1b',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '800px',
        }}>
          <Box sx={{
            position: { xs: 'static', sm: 'static', md: 'static', lg: 'absolute' },
            top: { lg: '64px' },
            right: { lg: '20px' },
            textAlign: 'center',
            mb: { xs: 2, sm: 2, md: 2, lg: 0 },
            order: { xs: -1, sm: -1, md: -1, lg: 0 }
          }}>
            <Typography variant="h6" sx={{ color: '#ffff66' }}>{userName}</Typography>
            <Typography variant="subtitle1" sx={{ color: '#00ffcc' }}>Nivel {nivelPersonaje}</Typography>
            <img src={currentGif} alt="Character" style={{ width: '200px', height: 'auto' }} />
          </Box>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ffff66', mb: 2 }}>
              Cambiar Fondo
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: '#00ffcc',
                color: '#1b1b1b',
                '&:hover': {
                  backgroundColor: '#00ffaa',
                },
                mb: 2,
              }}
            >
              Subir Imagen
              <input type="file" accept="image/*,image/gif" onChange={handleBackgroundChange} hidden />
            </Button>
          </Box>
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

            <Button
              fullWidth
              variant="contained"
              onClick={reiniciarTodo}
              sx={{
                backgroundColor: '#ff6666',
                color: '#1b1b1b',
                '&:hover': {
                  backgroundColor: '#ff3333',
                },
                mt: 2,
              }}
            >
              REINICIAR TODO
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (window.confirm('¿Seguro que quieres reiniciar todo y volver a empezar?')) {
                  localStorage.clear();
                  setSkills([]);
                  setMainSkills([]);
                  setUserName(null);
                  setDineroTotal(0);
                  setGastoTotal(0);
                  setMetaDinero(undefined);
                  setBackgroundImage(null);
                  setNivelPersonaje(1);
                  setCurrentGif('assets/gifs/Fase1.gif');
                }
              }}
              sx={{
                backgroundColor: '#ff9966',
                color: '#1b1b1b',
                '&:hover': {
                  backgroundColor: '#ff7733',
                },
                mt: 2,
              }}
            >
              REINICIAR Y VOLVER A EMPEZAR
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
