import axios, {AxiosResponse} from "axios";
import uuid from "uuid";

const SUB_DOMAIN = `zebra.basics.api.xilution.com`;

export const authenticate = (
    env: string,
    organizationId: string,
    accessToken: string,
): Promise<AxiosResponse> => axios.post(`https://${env}.${SUB_DOMAIN}/organizations/${organizationId}/oauth/authenticate`, {
    access_token: accessToken,
}, {
    validateStatus: () => true,
});

export const tokenFromGrantTypeAuthorizationCode = (
    env: string,
    organizationId: string,
    clientId: string,
    code: string,
    redirectUri: string,
): Promise<AxiosResponse> => axios.post(`https://${env}.${SUB_DOMAIN}/organizations/${organizationId}/oauth/token`, {
    client_id: clientId,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
}, {
    validateStatus: () => true,
});

export const tokenFromGrantTypeRefreshToken = (
    env: string,
    organizationId: string,
    clientId: string,
    refreshToken: string,
    scope: string,
): Promise<AxiosResponse> => axios.post(`https://${env}.${SUB_DOMAIN}/organizations/${organizationId}/oauth/token`, {
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope,
}, {
    validateStatus: () => true,
});
