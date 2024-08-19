import { createContext, useContext, useEffect, useReducer } from "react";

const URL = "http://localhost:3000/cities";
// 1) Create Context
const citiesContext = createContext();
const initalState = {
  cities: [],
  isLoading: false,
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    default:
  }
}
// eslint-disable-next-line react/prop-types
function CitiesProvider({ children }) {
  const [{ cities, isLoading }, dispatch] = useReducer(reducer, initalState);
  async function fetchCities() {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(URL);
      const data = await response.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data ",
      });
    }
  }
  async function addData(newData) {
    dispatch({ type: "loading" });
    const apiUrl = URL;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const data = await response.json();
      console.log("Success", data);
      // setCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error createing the city...",
      });
    }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${URL}/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }
  useEffect(function () {
    fetchCities();
  }, []);
  return (
    <citiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        addData: addData,
        deleteCity: deleteCity,
      }}
    >
      {children}
    </citiesContext.Provider>
  );
}
//make custom hook
function useCities() {
  const context = useContext(citiesContext);
  if (context === undefined)
    throw new Error("The Context is outside the provider");
  return context;
}
export { CitiesProvider, useCities };
