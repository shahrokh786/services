import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchBox = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access the current URL

    // Get the initial keyword from the URL's query parameters when the component first loads
    const urlKeyword = new URLSearchParams(location.search).get('keyword') || '';
    const [keyword, setKeyword] = useState(urlKeyword);

    // CRITICAL ARCHITECTURAL FIX: This makes the component "URL-aware".
    // This useEffect hook listens for changes in the URL. If the user navigates
    // (e.g., by clicking a category link), this code will run and update the
    // search box to reflect the new search state.
    useEffect(() => {
        const newUrlKeyword = new URLSearchParams(location.search).get('keyword') || '';
        setKeyword(newUrlKeyword);
    }, [location.search]); // The dependency array ensures this runs every time the URL query string changes

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${keyword.trim()}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} className="flex items-center relative">
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder="Search services..."
                className="text-sm bg-gray-100 text-gray-800 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
            />
            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600">
                {/* Search Icon for better UI/UX */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </button>
        </form>
    );
};

export default SearchBox;

