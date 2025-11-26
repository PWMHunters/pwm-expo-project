import axios from "axios";

export const headerJson = {
  "Content-Type": "application/json",
};

export const headerRevocableSession = {
  "X-Parse-Revocable-Session": "1",
};

export const xParseSessionTokenKey = "X-Parse-Session-Token";

export const instance = axios.create({
  baseURL: "https://parseapi.back4app.com",
  timeout: 10000,
  headers: {
    "X-Parse-Application-Id": "NVQcXQMPovLGPz1hqHh0YbzimicUrY1rZp9nOjDE",
    "X-Parse-JavaScript-Key": "UfUQE72sbQN954GqHTifJ2Un6SUnaw6gcpQHSj4X",
  },
});