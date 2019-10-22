import * as queryString from "query-string";
import * as React from "react";
import uuid from "uuid";
import {IAuthProviderProps, IAuthProviderState} from "./@types";
import AuthContext from "./auth-context";
import {
    fetchContextObjects,
    fetchTokensWithAuthorizationCode,
    fetchTokensWithRefreshToken,
} from "./services/authentication-service";
import {
    deleteAccessToken,
    deleteRefreshToken,
    getAccessToken,
    getRefreshToken,
    isAccessTokenActive,
    isRefreshTokenActive,
    setAccessToken,
    setRefreshToken,
} from "./services/token-service";

const CODE_RESPONSE_TYPE = "code";

const buildAuthUrl = (
    env: string,
    organizationId: string,
) => `https://${organizationId}.${env}.iam.xilution.com`;

const buildAuthUrlWithRedirect = (
    env: string,
    organizationId: string,
    redirectUri: string,
    clientId: string,
    responseType: string,
    scope: string,
    state: string,
) => `${buildAuthUrl(env, organizationId)}?${queryString.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope,
    state,
})}`;

const getQueryParameters = () => {
    const search = queryString.parse(location.search);
    const code = search.code as string;
    const clientId = search.client_id as string;
    const responseType = search.response_type as string;
    const scope = search.scope as string;
    const state = search.state as string;
    const redirectUri = search.redirect_uri as string;

    return {
        clientId,
        code,
        redirectUri,
        responseType,
        scope,
        state,
    };
};

const buildState = () => uuid.v4().split("-").join("");

class AuthProvider extends React.Component<IAuthProviderProps, IAuthProviderState> {
    public static defaultProps = {
        query: getQueryParameters(),
        redirect: true,
    };

    constructor(props: IAuthProviderProps) {
        super(props);

        this.signIn = this.signIn.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.reauthenticate = this.reauthenticate.bind(this);
        this.signOut = this.signOut.bind(this);

        this.state = {};
    }

    public async signIn(): Promise<void> {
        const {env, organizationId, clientId, query} = this.props;

        if (env && organizationId && clientId && query) {
            const {code} = query;

            if (code) {
                const redirectUri = window.location.href;
                const {accessToken, refreshToken} = await fetchTokensWithAuthorizationCode(env, organizationId, clientId, code, redirectUri);
                const {user, client, organization} = await fetchContextObjects(env, organizationId, accessToken);

                setAccessToken(accessToken);
                setRefreshToken(refreshToken);

                this.setState({
                    accessToken,
                    client,
                    organization,
                    refreshToken,
                    user,
                });
            }
        }

        return;
    }

    public async authenticate(): Promise<void> {
        const savedAccessToken = getAccessToken();

        if (savedAccessToken) {
            const savedRefreshToken = getRefreshToken();
            const {env, organizationId} = this.props;

            if (env && organizationId) {
                const {user, client, organization} = await fetchContextObjects(env, organizationId, savedAccessToken);

                this.setState({
                    accessToken: savedAccessToken,
                    client,
                    organization,
                    refreshToken: savedRefreshToken,
                    user,
                });
            }
        }

        return;
    }

    public async reauthenticate(): Promise<void> {
        const savedRefreshToken = getRefreshToken();

        if (savedRefreshToken) {
            const {env, organizationId, clientId, scope} = this.props;

            if (env && organizationId && clientId && scope) {
                const {accessToken, refreshToken} = await fetchTokensWithRefreshToken(env, organizationId, clientId, savedRefreshToken, scope);
                const {user, client, organization} = await fetchContextObjects(env, organizationId, accessToken);

                this.setState({
                    accessToken,
                    client,
                    organization,
                    refreshToken,
                    user,
                });
            }
        }

        return;
    }

    public signOut(): void {
        const {env, organizationId, clientId, scope} = this.props;

        if (env && organizationId && clientId && scope) {
            deleteAccessToken();
            deleteRefreshToken();

            this.setState({
                accessToken: undefined,
                organization: undefined,
                refreshToken: undefined,
                user: undefined,
            });

            const redirectUri = window.location.href;

            window.location.href = buildAuthUrlWithRedirect(
                env,
                organizationId,
                redirectUri,
                clientId,
                CODE_RESPONSE_TYPE,
                scope,
                buildState(),
            );
        }

        return;
    }

    public async componentDidMount() {
        document.addEventListener("sign-out", this.signOut, false);

        const {query} = this.props;

        if (query) {
            const {code} = query;

            if (code) {
                this.signIn();
            } else {
                if (isAccessTokenActive()) {
                    this.authenticate();
                } else if (isRefreshTokenActive()) {
                    this.reauthenticate();
                } else {
                    const {env, organizationId, clientId, scope} = this.props;

                    if (env && organizationId && clientId && scope) {
                        const redirectUri = window.location.href;

                        window.location.href = buildAuthUrlWithRedirect(
                            env,
                            organizationId,
                            redirectUri,
                            clientId,
                            CODE_RESPONSE_TYPE,
                            scope,
                            buildState(),
                        );
                    }
                }
            }
        }

        return;
    }

    public render() {
        return (
            <AuthContext.Provider value={this.state}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthProvider;
