import React, { useEffect, useState } from "react";
import styles from "./Search.module.css";

const CountryCard = ({ flag, name }) => {
    return (
        <div className="countryCard"> {/* Class name matches test case */}
            <img src={flag} alt={`Flag of ${name}`} className={styles.cardImg} />
            <h2>{name}</h2>
        </div>
    );
};

const API = "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries";

function Countries() {
    const [data, setData] = useState([]); // State for countries data
    const [error, setError] = useState(null); // State for error tracking
    const [loading, setLoading] = useState(true); // State for loading tracking
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(API);

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                }

                const jsonData = await response.json();
                setData(jsonData);
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
        return <div className={styles.loading}>Loading countries...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error fetching data: {error}</div>;
    }

    // Filter countries based on the search term
    const filteredCountries = data.filter((country) =>
        country.common.toLowerCase().includes(searchTerm)
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search for a country"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />

            {filteredCountries.length === 0 ? (
                <div className={styles.noResults}>No results found</div>
            ) : (
                <div className={styles.countries}>
                    {filteredCountries.map((country, index) => (
                        <CountryCard
                            key={country.common || index}
                            name={country.common}
                            flag={country.png}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Countries;
