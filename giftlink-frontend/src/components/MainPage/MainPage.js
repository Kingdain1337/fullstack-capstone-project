import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts`); // Fetching data from the backend API
                if (!response.ok) {
                    throw new Error("Failed to fetch gifts");
                }
                const data = await response.json();
                setGifts(data); // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching gifts:", error);
            }
        };
        fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`details/${productId}`);
    };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp); // Create a new Date object from the timestamp
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }); // Format the date to a readable format like "January 1, 2024"
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            {/* // Task 4: Display gift image or placeholder */}
                            {gift.image ? (
                                <img src={gift.image} alt={gift.name} className="card-img-top" />
                            ) : (
                                <img src="/path/to/placeholder.jpg" alt="Placeholder" className="card-img-top" />
                            )}

                            <div className="card-body">

                                {/* // Task 5: Display gift image or placeholder */}
                                <h5 className="card-title">{gift.name}</h5>
                                <p className="card-text">{gift.description}</p>

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition}
                                </p>

                                {/* // Task 6: Display gift image or placeholder */}
                                <p className="card-text">Added on: {formatDate(gift.timestamp)}</p>
                                

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
