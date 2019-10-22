import * as React from "react";
import {Subtract} from "utility-types";
import {IAuthProviderState} from "./@types";
import AuthContext from "./auth-context";

const injectAuth = <P extends IAuthProviderState>(Component: React.ComponentType<P>) =>
    class WithAuth extends React.Component<Subtract<P, IAuthProviderState>> {
        public render() {
            return (
                <AuthContext.Consumer>
                    {
                        (value: IAuthProviderState) => (
                            <Component
                                {...this.props as P}
                                accessToken={value.accessToken}
                                refreshToken={value.refreshToken}
                                user={value.user}
                                organization={value.organization}
                                client={value.client}
                            />
                        )
                    }
                </AuthContext.Consumer>
            );
        }
    };

export default injectAuth;
