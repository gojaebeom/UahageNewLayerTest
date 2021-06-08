export const renderErrorPage = ( ) => {
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";

    const isMobile = window.innerWidth > 750;
    document.body.innerHTML = 
    isMobile ? 
    `<img src="/img/404.svg" width="100%" height="100%"/>` :
    `<img src="/img/500.png" style="width:100%;height:100vh;"/>`;
}