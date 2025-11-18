import axios from "axios";

const FISH_API_KEY = "a40a348c-1005-4142-994c-38999e27d870";

const api = axios.create({
    baseURL: "https://api.nookipedia.com",
    headers: {
    "X-API-KEY": FISH_API_KEY,
    "Accept-Version": "1.0.0"
    }
});

export async function getBreeds() {
    const response = await api.get("/nh/fish");
    return response.data;
}
export const searchBreeds = async (query: string) => {
    const response = await api.get(`/nh/fish?q=${query}`);
    return response.data;
};