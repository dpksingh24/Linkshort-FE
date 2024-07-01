import React, { useState, useEffect } from 'react';
import { createUrl, getUrls, deleteUrl, getTopLevelDomains, searchUrls, getTopUrls, getSlugAndCount } from '../services/urlService';
import { useNavigate } from 'react-router-dom';

const UrlList = () => {
const [urls, setUrls] = useState([]);
const [topUrls, setTopUrls] = useState([]);
const [name, setName] = useState('');
const [expiresAt, setExpiresAt] = useState('');
const [topLevelDomains, setTopLevelDomains] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [searchedUrls, setSearchedUrls] = useState([]);
const [formVisible, setFormVisible] = useState(true);

const [loading, setLoading] = useState(false);
const [uRLSlug, setuRLSlug] = useState('');
const [uRLCount, setuRLCount] = useState(0);
const [urlName, setUrlName] = useState('');

const navigate = useNavigate();

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to handle form submission
const handleSubmit = async (event) => {

event.preventDefault();
setLoading(true);

const newUrl = { name, expires_at: expiresAt };
    try {
        const response = await createUrl(newUrl);
        setUrls([response, ...urls]); // Add the new URL to the beginning of the list

        setName('');
        setExpiresAt('');
        setFormVisible(false);

        const {slug, count} = await getSlugAndCount(response.id);
        setuRLSlug(slug);
        setuRLCount(count);
        setUrlName(response.name);

        const queryParams = new URLSearchParams();
        queryParams.append('name', name);
        queryParams.append('expiresAt', expiresAt);
        navigate(`/url-manager?${queryParams.toString()}`);

    } catch (error) {
        console.error('Error creating URL:', error);
    } finally {
        setLoading(false);
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
        navigate('/url-manager');
        setFormVisible(true);
    } catch (error) {
        console.error('Error deleting URL:', error);
    }
};

// Function to copy the slug url
const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard');
    }).catch((error) => {
        console.error('Error copying URL:', error);
    });
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
    const fetchData = async () => {
        try {
            await fetchUrls();
            await fetchTopUrls();
            await fetchTopLevelDomains();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);


// return (
//     <div className="container">
//       {/* Search Bar */}
//         <div className="search-bar">
//             <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search URL"
//             />
//         <button onClick={handleSearch}>Search</button>
//         </div>
//         <div className="search-results">
//             <div className="search-results-header">
//                 <strong>Search Results:</strong>
//                 {searchedUrls.length > 0 && (
//                     <button className="clear-button" onClick={clearSearchResults}>X</button>
//                 )}
//             </div>
//             <ul>
//                 {searchedUrls.length > 0 ? (
//                 searchedUrls.map((url) => (
//                     <li key={url.id}>
//                     <strong>Actual URL:</strong> {url.name}
//                     <br />
//                     <strong>Slug:</strong><a href={`${BASE_URL}/${url.slug}`} target="_blank" rel="noopener noreferrer">{`${BASE_URL}/${url.slug}`}</a>
//                     <br />
//                     <strong>Count:</strong> {url.count}
//                     </li>
//                 ))
//                 ) : (
//                 <p>No search results</p>
//                 )}

//             </ul>
//         </div>

//       {/* URL Form */}
//         <form onSubmit={handleSubmit} className="url-form">
//         <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="URL"
//             required
//         />
//         <input
//             type="datetime-local"
//             value={expiresAt}
//             onChange={(e) => setExpiresAt(e.target.value)}
//             placeholder="Expires At"
//         />
//         <button type="submit">Shorten URL</button>
//         </form>

//       {/* URL List */}
//         <div className="url-list">
//         <strong>All URLs:</strong>
//         <ul>
//             {urls.map((url) => (
//             <li key={url.id}>
//                 <strong>Actual URL:</strong> {url.name}
//                 <br />
//                 <strong>Slug:</strong><a href={`${BASE_URL}/${url.slug}`} target="_blank" rel="noopener noreferrer">{`${BASE_URL}/${url.slug}`}</a>
//                 <br />
//                 <strong>Count:</strong>{url.count}
//                 <br />
//                 <button onClick={() => handleDelete(url.id)}>Delete</button>
//             </li>
//             ))}
//         </ul>
//         </div>

//         {/* Top URLs */}
//         <div className="top-url-list">
//             <strong>Top URLs:</strong>
//             <ul>
//                 {topUrls.map((url) => (
//                     <li key={url.id}>
//                         <strong>Actual URL:</strong> {url.name}
//                         <br />
//                         <strong>Slug:</strong><a href={`${BASE_URL}/${url.slug}`} target="_blank" rel="noopener noreferrer">{`${BASE_URL}/${url.slug}`}</a>
//                         <br />
//                         <strong>Count:</strong> {url.count}
//                     </li>
//                 ))}
//             </ul>
//         </div>

//       {/* Top Level Domains */}
//         <div className="top-level-domains">
//         <strong>Top Level Domains:</strong>
//             <ul>
//                 {topLevelDomains.map((domain, index) => (
//                 <li key={index}>{domain.domain} ({domain.count})</li>
//                 ))}
//             </ul>
//         </div>
//     </div>
//     );
    return (
        <main>
        <section className="section-1">
            <nav>
            <div className="nav-main">
                <div className="nav-logo">
                <a href="index.html">
                    <img src="https://rvs-hosterr-waitlist-page.vercel.app/Assets/Logo.svg" alt="" />
                    <span>URL</span>
                </a>
                </div>
                <ul>
                <li><a href="#">Top Level Domains</a></li>
                <li><a href="#">About Us</a></li>
                </ul>
                <ul>
                <li><a href="#">Sign in</a></li>
                <li><a href="#">Join Waitlist</a></li>
                </ul>
                <div className="nav-mobile-menu" id="nav-mobile-menu">
                <img src="https://rvs-hosterr-waitlist-page.vercel.app/Assets/Hamburger-Menu.svg" alt="" />
                </div>
            </div>
            </nav>

            <nav className="mobile-menu">
            <div className="mobile-menu-main">
                <ul>
                    <li><a href="#">Top Level Domains</a></li>
                    <li><a href="#">About Us</a></li>
                </ul>
                <ul>
                <li><a href="#">Sign in</a></li>
                <li><a href="#">Join Waitlist</a></li>
                </ul>
            </div>
            </nav>

            <div className="section-1-main">
            <div className="section-1-content">
                <h1 className="section-1-title">Trim your Long URL less than a second.</h1>
                <p className="section-1-desc">Quickly trim your long URLs in under a second. With website name.</p>
                {formVisible ? (
                <form className="section-1-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter URL"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Expiration Date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </button>
                </form>
            ) : (
            urls.length > 0 && (  // Check if urls array has items
                <div className="url-details-container">
                <div className="url-info">
                    <strong>Actual URL:</strong> {urlName}
                </div>
                {uRLSlug && (
                    <div className="url-info">
                    <strong>Slug:</strong> {`${BASE_URL}/${uRLSlug}`}
                    <button className="copy-button" onClick={() => handleCopy(`${BASE_URL}/${uRLSlug}`)}>Copy</button>
                    </div>
                )}
                {uRLCount && (
                    <div className="url-info">
                    <strong>Count:</strong> {uRLCount}
                    </div>
                )}
                <div className="url-info">
                    <button className="delete-button" onClick={() => handleDelete(urls[0].id)}>Delete</button>
                </div>
                </div>
            )
                )}
                <p className="section-1-alt-txt">
                <img src="https://rvs-hosterr-waitlist-page.vercel.app/Assets/Checkmark.svg" alt="" />
                <span>URLs Made Short and Sweet.</span>
                </p>
            </div>
            <div className="section-1-imgs">
                <div className="section-1-imgs-main">
                <img src="https://rvs-hosterr-waitlist-page.vercel.app/Assets/Blue-Shape.svg" alt="" />
                <img src="https://rvs-hosterr-waitlist-page.vercel.app/Assets/Pink-Shape.svg" alt="" />
                <img src="https://rvs-hosterr-waitlist-page.vercel.app/Assets/Purple-Shape.svg" alt="" />
                <img src="https://rvs-hosterr-waitlist-page.vercel.app/Assets/Hero-Image-Model.png" alt="" />
                </div>
            </div>
            </div>

            <footer>
            <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
            </ul>
            <div className="user-content">
                <div className="user-img">
                <img src="https://media.licdn.com/dms/image/D5635AQEg47d9HH0-FQ/profile-framedphoto-shrink_400_400/0/1719451489610?e=1720422000&v=beta&t=pXRaVWRvF0pmq-I58ChAO533pJyk0xYlIPth7w4RO0w" alt="" />
                </div>
                <div className="user-details">
                <h5>Have any questions?</h5>
                <h4><a href="#">Talk to a specialist</a></h4>
                </div>
            </div>
            </footer>
        </section>
        </main>
    );
};

export default UrlList;
