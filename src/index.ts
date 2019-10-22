import injectAuth from "./auth/auth-consumer";
import AuthProvider from "./auth/auth-provider";
import signOut from "./auth/sign-out";

export default AuthProvider;

export {
    injectAuth,
    signOut,
};
