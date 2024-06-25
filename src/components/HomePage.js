import React,{useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/home.css';

const HomePage = () => {
    useEffect(() => {
        // Add the class when the component mounts
        document.body.classList.add('home-overflow-hidden');

        // Clean up by removing the class when the component unmounts
        return () => {
            document.body.classList.remove('home-overflow-hidden');
        };
    }, []);
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/url-manager');
    };

    return (
        <div className="home-container">
            <h1>Welcome to URL Shortener</h1>
            <button className="redirect-button" onClick={handleRedirect}>Click Here to Manage URLs</button>
        </div>
    );
};

export default HomePage;
