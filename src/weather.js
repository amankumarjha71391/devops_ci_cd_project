import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = '8f89c1dc7e5c851082201785db3ab977'; // Replace with your OpenWeatherMap API key
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const getWeather = () => {
    if (city === '') return;

    axios
      .get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`)
      .then((response) => {
        if (response.data.cod === '404') {
          setError('City not found. Please try again.');
          setWeatherData(null);
        } else {
          setWeatherData(response.data);
          setError('');
        }
      })
      .catch((error) => {
        setWeatherData(null);
        setError('An error occurred. Please try again later.');
      });
  };

  const onChange = (event, { newValue }) => {
    setCity(newValue);
    if (newValue.length > 2) {
      fetchSuggestions(newValue);
    }
  };

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${API_KEY}`);
      const suggestions = response.data.list.map((city) => city.name);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching city suggestions', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInputComponent = (inputProps) => (
    <input {...inputProps} />
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value);
  };

  return (
    <div className="weather-container">
      <div className="background-overlay"></div>
      <div className="search-box">
        <h1>Weather App</h1>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={() => setSuggestions([])}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={(suggestion) => <div>{suggestion}</div>}
          inputProps={{
            placeholder: 'Search city...',
            value: city,
            onChange: onChange
          }}
          renderInputComponent={renderInputComponent}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {weatherData && (
        <div className="weather-details">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p><strong>Temperature:</strong> {weatherData.main.temp}°C</p>
          <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
          <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
