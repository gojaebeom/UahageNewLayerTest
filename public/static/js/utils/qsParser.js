import { renderErrorPage } from "./error.js";

export const getQuerystringInfo = () => {
    const path = location.search.substring( 1 );
    console.log( path );
    if( path === "" ){
        renderErrorPage();
        console.log("쿼리스트링이 없습니다");
        throw new Error("not find querystring");
    }
    return JSON.parse('{"' + decodeURI(path)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g,'":"') + '"}');

}