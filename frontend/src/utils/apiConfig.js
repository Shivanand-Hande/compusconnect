const getBaseURL = () => {
    // If we're in production, the API is hosted on the same domain
    if (import.meta.env.PROD) {
        return window.location.origin;
    }

    // In development, we use localhost:5000
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
};

export const API_URL = getBaseURL();
export const UPLOAD_URL = (import.meta.env.PROD) ? `${window.location.origin}/api/uploads` : `${API_URL}/uploads`;
