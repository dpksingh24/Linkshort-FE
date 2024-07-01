import React, { useState, useEffect } from 'react';
import { createUrl, getUrls, deleteUrl, getTopLevelDomains, searchUrls, getTopUrls, getSlugAndCount } from '../services/urlService';
import { useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import PolarAreaChart from './PolarAreaChart';

const UrlList = () => {

    const imagePath = '../images/link-hyperlink-color-icon.svg';

    const [formVisible, setFormVisible] = useState(true);
    const [urls, setUrls] = useState([]);
    const [name, setName] = useState('');
    const [expiresAt, setExpiresAt] = useState('');

    const [topUrls, setTopUrls] = useState([]);

    const [topLevelDomains, setTopLevelDomains] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedUrls, setSearchedUrls] = useState([]);

    const [copiedUrlId, setCopiedUrlId] = useState(null);


    // const [uRLSlug, setuRLSlug] = useState('');
    // const [uRLCount, setuRLCount] = useState(0);
    // const [urlName, setUrlName] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (expiresAt && new Date(expiresAt) >= new Date()) {
            const newUrl = { name, expires_at: expiresAt };
                try {
                    const response = await createUrl(newUrl);
                    setUrls([response, ...urls]); // Add the new URL to the beginning of the list

                    setName('');
                    setExpiresAt('');
                    setFormVisible(false);

                    // const {slug, count} = await getSlugAndCount(response.id);
                    // setuRLSlug(slug);
                    // setuRLCount(count);
                    // setUrlName(response.name);

                    const queryParams = new URLSearchParams();
                    queryParams.append('name', name);
                    queryParams.append('expiresAt', expiresAt);
                    navigate(`/url-manager?${queryParams.toString()}`);
                }
                catch (error) {
                    console.error('Error creating URL:', error);
                }
                finally {
                    setLoading(false);
                }
        } else {
                alert('Expiration date must be a future or current date. URL not created.');
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
            setCopiedUrlId(url.id);
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

        // Check for query parameters and set form visibility accordingly
        const queryParams = new URLSearchParams(location.search);
        console.log('Query Params:', queryParams.toString());
        if (queryParams.has('name') || queryParams.has('expiresAt')) {
            console.log('Form hidden based on query params');
            setFormVisible(false);
        } else {
            setFormVisible(true);
        }
    }, [location.search]);

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
                    <a href="/url-manager">
                        <img src={imagePath} alt="Logo" />
                    <span>Trimly</span>
                    </a>
                    </div>
                    <ul>
                    <li><a href="#">Top Level Domains</a></li>
                    <li><a href="#">About Us</a></li>
                    </ul>
                    <ul>
                    {/* <li><a href="#">Sign in</a></li> */}
                    <li><a href="#">Sign in</a></li>
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
                    {/* <li><a href="#">Sign in</a></li> */}
                    <li><a href="#">Sign in</a></li>
                    </ul>
                </div>
                </nav>

                <div className="section-1-main">
                <div className="section-1-content">
                    <h1 className="section-1-title">Trimly will short your Long URL less than a second.</h1>
                    <p className="section-1-desc">Trimly provides efficient URL shortening for seamless link management and easy sharing.</p>
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
                            <strong>Actual URL:</strong> {urls[0].name}
                        </div>
                        <div className="url-info">
                            <strong>Slug:</strong> {`${BASE_URL}/${urls[0].slug}`}
                            <button
                                className="copy-button"
                                onClick={() => handleCopy(`${BASE_URL}/${urls[0].slug}`)}
                                disabled={copiedUrlId === urls[0].id}
                            >
                                {copiedUrlId === urls.id ? "Copied" : "Copy"}
                            </button>

                        </div>
                        <div className="url-info">
                            <strong>Count:</strong> {urls[0].count}
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
                        <PolarAreaChart topLevelDomains={topLevelDomains} />
                    </div>
                </div>
                </div>

                <footer>
                <ul>
                    <li><a href="https://www.instagram.com/_rawat_dpk_/">Instagram</a></li>
                    <li><a href="https://www.linkedin.com/in/deepaksingh24/">Linkedin</a></li>
                </ul>
                <div className="user-content">
                    <div className="user-img">
                    <img src="https://media.licdn.com/dms/image/D5635AQEg47d9HH0-FQ/profile-framedphoto-shrink_400_400/0/1719451489610?e=1720422000&v=beta&t=pXRaVWRvF0pmq-I58ChAO533pJyk0xYlIPth7w4RO0w" alt="" />
                    </div>
                    <div className="user-details">
                    <h5>Have any questions?</h5>
                    <h4><a href="https://www.linkedin.com/in/deepaksingh24" target="_blank">Talk to a specialist</a></h4>
                    </div>
                </div>
                </footer>
            </section>
            </main>
        );
};

export default UrlList;
