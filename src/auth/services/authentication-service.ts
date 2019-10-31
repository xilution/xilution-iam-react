import {
    authenticate,
    getTokenWithAuthorizationCode,
    getTokenWithRefreshToken,
} from "../brokers/xilution-basics-zebra-broker";

export const fetchTokensWithAuthorizationCode = async (
    env: string,
    organizationId: string,
    clientId: string,
    code: string,
    redirectUri: string,
) => {
    const response = await getTokenWithAuthorizationCode(env, organizationId, clientId, code, redirectUri);
    const {status, data} = response;

    if (status !== 200) {
        throw new Error(data.message);
    } else {
        const {access_token, refresh_token} = data;

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
        };
    }
};

export const fetchTokensWithRefreshToken = async (
    env: string,
    organizationId: string,
    clientId: string,
    refreshToken: string,
    scope: string,
) => {
    const response = await getTokenWithRefreshToken(env, organizationId, clientId, refreshToken, scope);
    const {status, data} = response;

    if (status !== 200) {
        throw new Error(data.message);
    } else {
        const {access_token, refresh_token} = data;

        return {
            accessToken: access_token,
            refreshToken: refresh_token,
        };
    }
};

export const fetchContextObjects = async (
    env: string,
    organizationId: string,
    accessToken: string,
) => {
    const response = await authenticate(env, organizationId, accessToken);
    const {status, data} = response;

    if (status !== 200) {
        throw new Error(data.message);
    } else {
        const {user, client, organization} = data;

        return {
            client,
            organization,
            user,
        };
    }
};
