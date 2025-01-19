import styles from './Search.module.css';
import React, { useState, useEffect } from 'react';

const CountryCard = ({ flag, name }) => {
    return (
        <div className={styles.Card}> 
            <img src={flag} alt={`Flag of ${name}`} className={styles['Card-img']} /> 
            <h2>{name}</h2>
        </div>
    );
};

const API = "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries";

function Countries() {
    const [data, setData] = useState([]); 
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]); 

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch(API);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                }
                const jsonData = await response.json();
                setData(jsonData);
                setFilteredCountries(jsonData); // Initially show all countries
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
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = data.filter((country) => 
            country.common && country.common.toLowerCase().includes(searchValue)
        );

        setFilteredCountries(filtered);
    };

    if (loading) {
        return <div className={styles.loading}>Loading countries...</div>;  
    }

    if (error) {
        return <div className={styles.error}>Error fetching data: {error}</div>;  
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search for a country"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}  
            />
            <div className={styles.countries}>  
                {filteredCountries.length === 0 ? (
                    <div className={styles.noResults}>No countries found</div>  
                ) : (
                    filteredCountries.map((country) => (
                        <CountryCard
                            key={country.common} 
                            name={country.common}
                            flag={country.png}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Countries;
