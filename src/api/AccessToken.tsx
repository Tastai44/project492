import axios from "axios";

export const requestAccessToken = async (code: string) => {
    const requestData = {
        code: code,
        redirect_uri: 'https://www.cmuexplore.com/callback',
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
        client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
        grant_type: 'authorization_code',
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    return await axios
        .post('https://oauth.cmu.ac.th/v1/GetToken.aspx', requestData, { headers })
        .then((response) => response.data)
        .catch((error) => {
            console.error('Error:', error);
        });
};

export const getUserInfo = async (accessToken: string) => {
    return await axios.request({
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: "GET",
        url: 'https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo'
    }).then((response) => response.data);
};