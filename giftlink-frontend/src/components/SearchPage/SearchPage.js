import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    // Task 1: Define state variables for the search query, age range, and search results.
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [ageYears, setAgeYears] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                name: searchQuery,
                category,
                condition,
                age_years: ageYears
            }).toString();
            console.log(query);

            const response = await fetch(`${urlConfig.backendUrl}/api/search?${query}`);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setSearchResults(data);
            setFilteredResults(data); // Update filtered results
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchSearchResults();
    };

    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleConditionChange = (e) => setCondition(e.target.value);
    const handleAgeChange = (e) => setAgeYears(e.target.value);
    const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);

    const goToDetailsPage = (productId) => {
        navigate(`/app/details/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            <select className="dropdown-filter mb-2" value={category} onChange={handleCategoryChange}>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select className="dropdown-filter mb-2" value={condition} onChange={handleConditionChange}>
                                <option value="">Select Condition</option>
                                {conditions.map(cond => (
                                    <option key={cond} value={cond}>{cond}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                className="age-range-slider mb-2"
                                value={ageYears}
                                onChange={handleAgeChange}
                                placeholder="Age in years"
                            />
                            <input
                                type="text"
                                className="search-input mb-2"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                placeholder="Search by name"
                            />
                            <button className="search-button" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                    </div>
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    {searchResults.length === 0 && !loading && !error && <div>No products found</div>}
                    <div className="row">
                        {filteredResults.map((gift) => (
                            <div key={gift.id} className="col-md-4 mb-3">
                                <div className="search-results-card p-3 border rounded" onClick={() => goToDetailsPage(gift.id)}>
                                    <h6>{gift.name}</h6>
                                    <p>{gift.category}</p>
                                    <p>{gift.condition}</p>
                                    <img src={gift.image} alt={gift.name} className="img-fluid" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
