export const sendRequest = async (url, method = 'GET', data) => {
    const token = localStorage.getItem('adminToken');
    let payload = null;
    if (token) {
        payload = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: method !== 'GET' ? JSON.stringify(data) : undefined,
        }
    } else {
        payload = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: method !== 'GET' ? JSON.stringify(data) : undefined,
        }
    }
    
    const response = await fetch(url, payload);
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
}


