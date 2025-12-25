import React, { useState } from 'react';
import './App.css';

function App() {
  // Secuencia correcta: verde, verde, cafe, rojo, rojo, azul
  const correctSequence = ['green', 'green', 'brown', 'red', 'red', 'blue'];
  
  // Estados
  const [userSequence, setUserSequence] = useState([]);
  const [indicators, setIndicators] = useState(Array(6).fill('gray'));
  const [isError, setIsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Función para manejar el clic en un botón
  const handleButtonClick = (color) => {
    if (isShaking) return; // No permitir clicks durante la animación
    
    const newSequence = [...userSequence, color];
    const currentIndex = userSequence.length;
    
    // Verificar si el color es correcto
    if (color === correctSequence[currentIndex]) {
      // Color correcto
      const newIndicators = [...indicators];
      newIndicators[currentIndex] = 'green';
      setIndicators(newIndicators);
      setUserSequence(newSequence);
      
      // Verificar si se completó la secuencia
      if (newSequence.length === correctSequence.length) {
        setTimeout(() => {
          alert('FELICIDADES EL TESORO ESTÁ EN 1D');
        }, 500);
      }
    } else {
      // Color incorrecto - mostrar error y reiniciar
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
