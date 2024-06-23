import React, { useState, useEffect } from 'react';
import { createUrl, getUrls, deleteUrl, getTopLevelDomains } from '../services/urlService';

const UrlList = () => {
const [urls, setUrls] = useState([]);
const [name, setName] = useState('');
const [expiresAt, setExpiresAt] = useState('');
const [topLevelDomains, setTopLevelDomains] = useState([]);

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

// Function to get all top level domains from API
const fetchTopLevelDomains = async () => {
    try {
      const domains = await getTopLevelDomains();
      console.log(domains);
      const domainArray = Object.keys(domains).map(key=>({
        domain: key,
        count: domains[key]
      }));
      setTopLevelDomains(domainArray || []);
    } catch (error) {
      console.error('Error fetching top level domains:', error);
    }
  };

// Function to delete URLs from API
const handleDelete = async (id) => {
    try {
        await deleteUrl(id);
        // Filter out the deleted URL from the state
        const updatedUrls = urls.filter(url => url.id !== id);
        setUrls(updatedUrls);
    } catch (error) {
        console.error('Error deleting URL:', error);
    }
};

// Fetch URLs on component mount
useEffect(() => {
    fetchUrls();
    fetchTopLevelDomains();
}, []); // Empty dependency array ensures this runs once on mount

return (
<div className="container">
    <form onSubmit={handleSubmit} className='url-form'>
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
    <ul className="url-list">
    {urls.map((url) => (
        <li key={url.id}>
            <strong>Actual URL:</strong> {url.name}
        <br />
            <strong>Slug:</strong> {url.slug}
        <br />
            <button onClick={() => handleDelete(url.id)}>Delete</button>
        </li>
    ))}
    </ul>
    <br />
    <ul className="top-level-domains">
    <strong>Top Level Domains</strong>
    {topLevelDomains.map((domain, index) => (
        <li key={index}>{domain.domain} ({domain.count})</li>
    ))}
    </ul>
</div>
);
};

export default UrlList;
