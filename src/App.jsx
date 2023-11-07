import { useState, useEffect } from "react";

function App() {
  const apiKey =
    "cf7d13ba4const apiKey = process.env.REACT_APP_WEATHER_API_KEY;1828a8bf38d88090af934b4";
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Bogor");
  const [inputCity, setInputCity] = useState("");

  useEffect(() => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
        setError(null); // Tambahkan ini
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        setTimeout(() => {
          setError(null);
        }, 1000);
      });
  }, [city]);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getCurrentDate = () => {
    return now.toLocaleDateString();
  };

  const getCurrentTime = () => {
    return now.toLocaleTimeString();
  };

  const handleCityChange = (event) => {
    setInputCity(event.target.value);
  };

  const handleCitySubmit = (event) => {
    event.preventDefault();
    setCity(inputCity);
    setLoading(true);
  };

  return (
    <>
      <div className="container w-screen h-screen flex flex-col items-center justify-between">
        <div className="mt-20">
          <form onSubmit={handleCitySubmit}>
            <input
              className="py-2 px-2 bg-transparent text-lg font-light border border-gray-500 rounded-md placeholder:text-gray-500 text-white"
              type="text"
              value={inputCity}
              onChange={handleCityChange}
              placeholder="Name of city.."
            />
            <button
              type="submit"
              className="py-2 px-2 ml-2 bg-gray-500 text-black rounded-md"
            >
              Update
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            <div>Sedang Memuat...</div>
          </div>
        ) : (
          <>
            <div className="flex flex-col text-white items-center space-y-4">
              {weatherData && (
                <>
                  <h1 className="text-xl font-extralight uppercase">
                    {weatherData.name}, {weatherData.sys.country}
                  </h1>
                  <p className="text-8xl font-bold my-1">
                    {Math.round(weatherData.main.temp - 273.15)}°C
                  </p>{" "}
                  <p className="font-extralight my-1">
                    {getCurrentDate()} | {getCurrentTime()}
                  </p>
                </>
              )}
            </div>
            {weatherData && (
              <div className="flex flex-row justify-center space-x-3 text-white mb-20">
                <p>
                  Humidity{" "}
                  <span className="font-bold">{weatherData.main.humidity}</span>
                </p>
                <p>
                  Wind Speed{" "}
                  <span className="font-bold">{weatherData.wind.speed}</span>
                </p>
              </div>
            )}
            {error ? (
              <div className="bg-red-500 text-white p-3 rounded-md mt-3">
                <h1>Error: {error}</h1>
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}

export default App;
