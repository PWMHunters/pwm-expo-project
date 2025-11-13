import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.thedogapi.com/v1/',
  headers: {
    'x-api-key': 'live_XtRbOf4uMZUV2Wvm6bPmaNZGBBX5tVeFQWrgkIxy74jpkrxkcYO414gMVwfHb72t',
  },
});

export default api;