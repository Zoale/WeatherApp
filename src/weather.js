import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(''); // Variable de estado para la imagen de fondo

  const API_KEY = '75916f3ce4fc556cc2517ad0db1919e4'; // Reemplaza con tu API key real

  const getWeather = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`);
      setWeather(response.data);
      updateBackgroundImage(response.data);
    } catch (error) {
      console.error("Error fetching the weather data", error);
    }
  };

  const updateBackgroundImage = (weatherData) => {
    const temp = weatherData.main.temp;
    const currentTime = new Date().getHours();
    const isDaytime = currentTime >= 6 && currentTime < 18; // Consideramos de día entre 6 AM y 6 PM

    let imageName;

    if (temp < 15) {
      imageName = isDaytime ? 'cold-day.jpg' : 'cold-night.jpg';
    } else {
      imageName = isDaytime ? 'hot-day.jpg' : 'hot-night.jpg';
    }

    const imageUrl = `/img/${imageName}`; // Ruta relativa desde el directorio público

    setBackgroundImage(imageUrl);
  };

  useEffect(() => {
    if (weather) {
      updateBackgroundImage(weather);
    }
  }, [weather]);

  useEffect(() => {
    // Actualizar el fondo de la página
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.height = '100vh';
    }

    // Limpiar el estilo al desmontar el componente
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.height = '';
    };
  }, [backgroundImage]);

  return (
    <div className="weather-container">
      <h1>Aplicación del clima</h1>
      <input
        type="text"
        placeholder="Introduzca la ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="weather-input"
      />
      <button onClick={getWeather} className="weather-button">Haga click</button>
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>Temperatura: {weather.main.temp}°C</p>
          <p>Clima: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
