import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
       /* if (!authenticationToken) {
            navigate('/app/login');
            return;
        }*/

        const fetchGift = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();
        window.scrollTo(0, 0);
    }, [productId, navigate]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date
    };

    const formatAge = (ageInYears) => {
        const totalMonths = Math.round(ageInYears * 12);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
    
        let yearText = years === 1 ? "1 year" : `${years} years`;
        let monthText = months === 1 ? "1 month" : `${months} months`;
    
        return `${yearText} and ${monthText}`;
    };

	//The comments have been hardcoded for this project.
    const comments = [
        { author: "John Doe",       comment: "I would like this!" },
        { author: "Jane Smith",     comment: "Just DMed you." },
        { author: "Alice Johnson",  comment: "I will take it if it's still available." },
        { author: "Mike Brown",     comment: "This is a good one!" },
        { author: "Sarah Wilson",   comment: "My family can use one. DM me if it is still available. Thank you!" }
    ];


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gift) return <div>Gift not found</div>;

return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                    {gift.image ? (
                        <img src={gift.image} alt={gift.name} className="product-image-large" />
                    ) : (
                        <div className="no-image-available-large">No Image Available</div>
                    )}
                    </div>
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {formatDate(gift.date_added)}</p>
                    <p><strong>Age:</strong> {formatAge(gift.age_years)}</p>
                    <p><strong>Description:</strong> {gift.description}</p>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailsPage;
