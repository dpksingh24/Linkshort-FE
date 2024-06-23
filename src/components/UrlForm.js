import React, { useState, useEffect } from 'react';
import { createUrl, getUrls } from '../services/urlService';

const UrlList = () => {
const [urls, setUrls] = useState([]);
const [name, setName] = useState('');
const [expiresAt, setExpiresAt] = useState('');

// Function to handle form submission
const handleSubmit = async (event) => {
event.preventDefault();
const newUrl = { name, expires_at: expiresAt };
    try {
        const response = await createUrl(newUrl);
        console.log('URL created:', response);
        // Immediately update the URLs state with the newly created URL
        setUrls([response, ...urls]); // Add the new URL to the beginning of the list
        // Clear form fields after successful submission
        setName('');
        setExpiresAt('');
    } catch (error) {
        console.error('Error creating URL:', error);
        }
    };

// Function to fetch URLs from API
const fetchUrls = async () => {
    try {
        const response = await getUrls();
        // Sort URLs by created_at descending order (newest first)
        const sortedUrls = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUrls(sortedUrls);
    } catch (error) {
        console.error('Error fetching URLs:', error);
    }
};

// Fetch URLs on component mount
useEffect(() => {
    fetchUrls();
}, []); // Empty dependency array ensures this runs once on mount

return (
<div>
    <h2>URL List</h2>
    <form onSubmit={handleSubmit}>
    <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="URL"
        required
    />
    <input
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        placeholder="Expires At"
        required
    />
    <button type="submit">Shorten URL</button>
    </form>
    <ul>
    {urls.map((url) => (
        <li key={url.id}>
            <strong>Actual URL:</strong> {url.name}
        <br />
            <strong>Slug:</strong> {url.slug}
        </li>
    ))}
    </ul>
</div>
);
};

export default UrlList;
