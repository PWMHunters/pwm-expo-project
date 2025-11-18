import axios from "axios";

const DOG_API_KEY = "live_wCWyw33Ka2reuR5ub2hZfzU9lL71hzkuS5HoDKbsqbFck8agCWJxEnRJOTj4TMGY";

const api = axios.create({
    baseURL: "https://api.thedogapi.com/v1",
    headers: {
    "x-api-key": DOG_API_KEY,
},
});

export const getBreeds = async () => {
    const response = await api.get("/breeds");
    return response.data;
};

export const searchBreeds = async (query: string) => {
    const response = await api.get(`/breeds/search?q=${query}`);
    return response.data;
};

export const getBreedImage = async (breedId: string) => {
    const response = await api.get(`/images/search?breed_ids=${breedId}`);
    return response.data[0];
};
export const getBreedById = async (id: string) => {
    const res = await api.get(`/breeds/${id}`);
    return res.data;
};
