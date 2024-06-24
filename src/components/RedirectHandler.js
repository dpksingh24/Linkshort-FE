import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

const RedirectHandler = () => {
    const { slug } = useParams();

    useEffect(() => {
        const fetchUrl = async () => {
        try {
            const response = await axiosInstance.get(`/${slug}`);
            console.log('Response:', response);
            console.log('Response Data:', response.data);
            window.location.href = response.data.name;
        } catch (error) {
            console.error('Error fetching URL:', error);
        }
        };

        fetchUrl();
    }, [slug]);

    return <div>Redirecting...</div>;
};

export default RedirectHandler;
