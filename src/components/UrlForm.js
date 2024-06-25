import React, { useState, useEffect } from 'react';
import { createUrl, getUrls, deleteUrl, getTopLevelDomains, searchUrls, getTopUrls } from '../services/urlService';

const UrlList = () => {
const [urls, setUrls] = useState([]);
const [topUrls, setTopUrls] = useState([]);
const [name, setName] = useState('');
const [expiresAt, setExpiresAt] = useState('');
const [topLevelDomains, setTopLevelDomains] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [searchedUrls, setSearchedUrls] = useState([]);

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
        console.log('Fetched URLs:', response);
        const sortedUrls = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUrls(sortedUrls);
    } catch (error) {
        console.error('Error fetching URLs:', error);
        }
};

// Function to fetch top URLs from API
const fetchTopUrls = async () => {
    try {
        const response = await getTopUrls();
        setTopUrls(response);
    } catch (error) {
        console.error('Error fetching top URLs:', error);
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

// Function to search URLs from API
const handleSearch = async () => {
    try {
    const result = await searchUrls(searchTerm);
    setSearchedUrls(result);
    } catch (error) {
    console.error('Error fetching URL by name:', error);
    }
};

// Function to clear search results
const clearSearchResults = () => {
    setSearchedUrls([]);
    setSearchTerm('');
};

// Fetch URLs on component mount
useEffect(() => {
    fetchUrls();
    fetchTopUrls();
    fetchTopLevelDomains();
}, []);

return (
    <div className="container">
      {/* Search Bar */}
        <div className="search-bar">
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search URL"
            />
        <button onClick={handleSearch}>Search</button>
        </div>
        <div className="search-results">
            <div className="search-results-header">
                <strong>Search Results:</strong>
                {searchedUrls.length > 0 && (
                    <button className="clear-button" onClick={clearSearchResults}>X</button>
                )}
            </div>
            <ul>
                {searchedUrls.length > 0 ? (
                searchedUrls.map((url) => (
                    <li key={url.id}>
                    <strong>Actual URL:</strong> {url.name}
                    <br />
                    <strong>Slug:</strong><a href={`${BASE_URL}/${url.slug}`} target="_blank" rel="noopener noreferrer">{`${BASE_URL}/${url.slug}`}</a>
                    <br />
                    <strong>Count:</strong> {url.count}
                    </li>
                ))
                ) : (
                <p>No search results</p>
                )}

            </ul>
        </div>

      {/* URL Form */}
        <form onSubmit={handleSubmit} className="url-form">
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
        />
        <button type="submit">Shorten URL</button>
        </form>

      {/* URL List */}
        <div className="url-list">
        <strong>All URLs:</strong>
        <ul>
            {urls.map((url) => (
            <li key={url.id}>
                <strong>Actual URL:</strong> {url.name}
                <br />
                <strong>Slug:</strong><a href={`${BASE_URL}/${url.slug}`} target="_blank" rel="noopener noreferrer">{`${BASE_URL}/${url.slug}`}</a>
                <br />
                <strong>Count:</strong>{url.count}
                <br />
                <button onClick={() => handleDelete(url.id)}>Delete</button>
            </li>
            ))}
        </ul>
        </div>

        {/* Top URLs */}
        <div className="top-url-list">
            <strong>Top URLs:</strong>
            <ul>
                {topUrls.map((url) => (
                    <li key={url.id}>
                        <strong>Actual URL:</strong> {url.name}
                        <br />
                        <strong>Slug:</strong><a href={`${BASE_URL}/${url.slug}`} target="_blank" rel="noopener noreferrer">{`${BASE_URL}/${url.slug}`}</a>
                        <br />
                        <strong>Count:</strong> {url.count}
                    </li>
                ))}
            </ul>
        </div>

      {/* Top Level Domains */}
        <div className="top-level-domains">
        <strong>Top Level Domains:</strong>
            <ul>
                {topLevelDomains.map((domain, index) => (
                <li key={index}>{domain.domain} ({domain.count})</li>
                ))}
            </ul>
        </div>
    </div>
    );
};

export default UrlList;
