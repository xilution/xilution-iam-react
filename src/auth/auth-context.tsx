import * as React from "react";
import {IAuthProviderState} from "./@types";

const defaultValue: IAuthProviderState = {};

const AuthContext = React.createContext(defaultValue);

export default AuthContext;
