/* eslint-disable react/prop-types */
import { useCities } from "../contexts/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
export default function CountriesList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  return (
    <ul className={styles.countryList}>
      {cities.map((city) => (
        <CountryItem country={city} key={city.id} />
      ))}
    </ul>
  );
}
