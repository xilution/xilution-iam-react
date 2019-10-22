import {decode} from "jsonwebtoken";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const isActive = (timeInMilliseconds: number) => new Date(timeInMilliseconds).getTime() > new Date().getTime();

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || undefined;

export const setAccessToken = (accessToken: string) => localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

export const deleteAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;

export const setRefreshToken = (refreshToken: string) => localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

export const deleteRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

const getExpiresTimeInMilliseconds = (accessToken: string | undefined) => {
    if (accessToken) {
        const payload = decode(accessToken) as { exp: number };

        return payload.exp * 1000;
    }

    return 0;
};

export const isAccessTokenActive = () => {
    const accessToken = getAccessToken();
    const expiresInMilliseconds = getExpiresTimeInMilliseconds(accessToken);

    return isActive(expiresInMilliseconds);
};

export const isRefreshTokenActive = () => {
    const refreshToken = getRefreshToken();
    const expiresInMilliseconds = getExpiresTimeInMilliseconds(refreshToken);

    return isActive(expiresInMilliseconds);
};
