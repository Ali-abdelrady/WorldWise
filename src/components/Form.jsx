/* eslint-disable no-unused-vars */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { addData } = useCities();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gecodingError, setGecodingError] = useState("");
  const [lat, lng] = useUrlPosition();
  useEffect(
    function () {
      if (!lat && !lng) {
        return;
      }
      async function FetchCityData() {
        try {
          setIsLoading(true);
          setGecodingError("");
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          const data = await response.json();
          if (!data.city)
            throw new Error(
              "👋 That doesn't seem to be a city. Click somewhere else 😉"
            );
          setCityName(data.city);
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGecodingError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (lat && lng) FetchCityData();
    },
    [lat, lng]
  );
  async function handleFormSubmit(e) {
    e.preventDefault();
    const newCity = {
      cityName: cityName,
      country: country,
      date: date,
      emoji: emoji,
      notes: notes,
      position: { lat, lng },
    };
    await addData(newCity);
    navigate("/app");
  }
  if (gecodingError) return <Message message={gecodingError} />;
  if (!lat & !lng) return <Message message={"Start by clickng on the map "} />;
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <div className={styles.row}>
            <label htmlFor="cityName">City name</label>
            <input
              id="cityName"
              onChange={(e) => setCityName(e.target.value)}
              value={cityName}
            />
            {/* <span className={styles.flag}>{emoji}</span> */}
          </div>

          <div className={styles.row}>
            <label htmlFor="date">When did you go to {cityName}?</label>
            <input
              id="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="notes">Notes about your trip to {cityName}</label>
            <textarea
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            />
          </div>

          <div className={styles.buttons}>
            <Button type={"primary"} onClick={handleFormSubmit}>
              Add
            </Button>
            <Button
              type={"back"}
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              &larr; Back
            </Button>
          </div>
        </form>
      )}
    </>
  );
}

export default Form;
