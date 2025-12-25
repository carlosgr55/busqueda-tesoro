import React, { useState, useCallback } from 'react';
import './App.css';

function App() {
  // Secuencia correcta: verde, verde, cafe, rojo, rojo, azul
  const correctSequence = ['green', 'green', 'brown', 'red', 'red', 'blue'];
  
  // Estados
  const [userSequence, setUserSequence] = useState([]);
  const [indicators, setIndicators] = useState(Array(6).fill('gray'));
  const [isError, setIsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  // Funciones para reproducir sonidos
  const playSuccessSound = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Crear un sonido agradable tipo Duolingo (acorde mayor)
    const frequencies = [523.25, 659.25, 783.99]; // Do, Mi, Sol
    const duration = 0.3;
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(audioContext.currentTime + duration + index * 0.1);
    });
  }, []);

  const playErrorSound = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Crear un sonido de error (frecuencias descendentes)
    const frequencies = [400, 300, 200];
    const duration = 0.2;
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(audioContext.currentTime + duration + index * 0.1);
    });
  }, []);

  const playCompletionSound = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Sonido de victoria más elaborado
    const melody = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do alto
    const duration = 0.4;
    
    melody.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime + index * 0.15);
      oscillator.stop(audioContext.currentTime + duration + index * 0.15);
    });
  }, []);

  // Función para manejar el clic en un botón
  const handleButtonClick = (color) => {
    if (isShaking) return; // No permitir clicks durante la animación
    
    const newSequence = [...userSequence, color];
    const currentIndex = userSequence.length;
    
    // Verificar si el color es correcto
    if (color === correctSequence[currentIndex]) {
      // Color correcto - reproducir sonido de éxito
      playSuccessSound();
      
      const newIndicators = [...indicators];
      newIndicators[currentIndex] = 'green';
      setIndicators(newIndicators);
      setUserSequence(newSequence);
      
      // Verificar si se completó la secuencia
      if (newSequence.length === correctSequence.length) {
        setTimeout(() => {
          playCompletionSound();
          setShowSuccessPage(true);
        }, 500);
      }
    } else {
      // Color incorrecto - reproducir sonido de error
      playErrorSound();
      
      // Mostrar error y reiniciar
      setIsError(true);
      setIsShaking(true);
      setIndicators(Array(6).fill('red'));
      
      // Reiniciar después de la animación
      setTimeout(() => {
        setUserSequence([]);
        setIndicators(Array(6).fill('gray'));
        setIsError(false);
        setIsShaking(false);
      }, 1000);
    }
  };

  // Función para reiniciar manualmente
  const resetGame = () => {
    setUserSequence([]);
    setIndicators(Array(6).fill('gray'));
    setIsError(false);
    setIsShaking(false);
  };

  // Función para regresar a la página principal
  const returnToMain = () => {
    setShowSuccessPage(false);
    resetGame();
  };

  // Si se debe mostrar la página de éxito
  if (showSuccessPage) {
    return (
      <div className="App">
        <div className="success-container">
          <h1>¡FELICIDADES!</h1>
          <h2>EL TESORO ESTÁ EN 1D</h2>
          <button className="continue-button" onClick={returnToMain}>
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="game-container">
        <h1>PISTA 9:</h1>
        <p>Presiona los botones en el orden correcto:</p>
        
        {/* Indicadores de progreso */}
        <div className="indicators">
          {indicators.map((color, index) => (
            <div
              key={index}
              className={`indicator ${color} ${isShaking ? 'shake' : ''}`}
            ></div>
          ))}
        </div>
        
        {/* Botones de colores */}
        <div className="buttons-container">
          <button
            className="color-button brown"
            onClick={() => handleButtonClick('brown')}
            disabled={isShaking}
          >
            Café
          </button>
          <button
            className="color-button green"
            onClick={() => handleButtonClick('green')}
            disabled={isShaking}
          >
            Verde
          </button>
          <button
            className="color-button red"
            onClick={() => handleButtonClick('red')}
            disabled={isShaking}
          >
            Rojo
          </button>
          <button
            className="color-button blue"
            onClick={() => handleButtonClick('blue')}
            disabled={isShaking}
          >
            Azul
          </button>
        </div>
        
        {/* Botón de reinicio */}
        <button className="reset-button" onClick={resetGame}>
          Reiniciar
        </button>
        
        {/* Progreso actual */}
        <div className="progress">
          <p>Progreso: {userSequence.length} / {correctSequence.length}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
