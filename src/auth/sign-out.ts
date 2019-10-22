export default (): void => {
    document.dispatchEvent(new CustomEvent("sign-out"));

    return;
};
