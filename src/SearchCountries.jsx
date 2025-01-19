import React, { useEffect, useState } from "react";
import styles from "./Search.module.css";

const CountryCard = ({ flag, name }) => {
    return (
        <div className={styles.countryCard}> {/* Ensure the class is as expected */}
            <img src={flag} alt={`Flag of ${name}`} className={styles['Card-img']} />
            <h2>{name}</h2> {/* Ensure name is wrapped in h2 */}
        </div>
    );
};

const API = "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries";

function Countries() {
    const [data, setData] = useState([]); // State for countries data
    const [error, setError] = useState(null); // State for error tracking
    const [loading, setLoading] = useState(true); // State for loading tracking
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(API);

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                }

                const jsonData = await response.json();
                setData(jsonData); // Use the response directly (no need to access "common" here)
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError(err.message); // Update error state
            } finally {
                setLoading(false); // Ensure loading ends
            }
        };

        fetchCountries();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    if (loading) {
        return <div className={styles.Loading}>Loading countries...</div>;
    }

    if (error) {
        return <div className={styles.Error}>Error fetching data: {error}</div>;
    }

    // Filter countries based on the search term
    const filteredCountries = data.filter((country) =>
        country.common && country.common.toLowerCase().includes(searchTerm)
    );

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search for a country" 
                value={searchTerm}
                onChange={handleSearchChange} 
                className={styles.SearchInput}
            />

            {/* Check if there are no results and display a message */}
            {filteredCountries.length === 0 ? (
                <div className={styles.NoResults}>No results found</div> // Show message when no results are found
            ) : (
                <div className={styles.Countries}>
                    {filteredCountries.map((country) => (
                        <CountryCard
                            key={country.common} // Using country.common as a unique key
                            name={country.common} // Country name from the "common" key
                            flag={country.png} // Flag URL from the "png" key
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Countries;
