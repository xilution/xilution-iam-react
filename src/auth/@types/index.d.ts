import {IXilutionClient, IXilutionOrganization, IXilutionUser} from "../../@types/global";

export interface IQuery {
    clientId?: string;
    code?: string;
    redirectUri?: string;
    responseType?: string;
    scope?: string;
    state?: string;
}

export interface IAuthProviderProps {
    env: string;
    organizationId: string;
    clientId: string;
    scope: string;
    query?: IQuery;
}

export interface IAuthProviderState {
    accessToken?: string;
    refreshToken?: string;
    user?: IXilutionUser;
    organization?: IXilutionOrganization;
    client?: IXilutionClient;
}
