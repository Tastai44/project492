import axios from "axios";

const requestAccessToken = async (code: string) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}getToken/${code}`
        );

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const getUserInfo = async (accessToken: string) => {
    return await axios.request({
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        method: "GET",
        url: `${import.meta.env.VITE_GETUSER_URL}v1/api/cmuitaccount/basicinfo`
    }).then((response) => response.data);
};

export { requestAccessToken, getUserInfo };
