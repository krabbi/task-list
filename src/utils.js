import md5 from 'md5';

export const dataURItoBlob = (dataURI) => {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

export const getQueryParams = (qs) => {
    qs = qs.split('+').join(' ');

    const params = {},
        re = /[?&]?([^=]+)=([^&]*)/g;
    let tokens;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

export const updateQueryStringParameter = (uri, key, value) => {
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
}

export const login = (login, password) => {
    return new Promise((resolve, reject) => {
        if (login === 'admin' && password === '123') {
            resolve();
            return;
        }
        reject();
    })
}

export const encodeRfc3986 = string => {
    return encodeURIComponent(string).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
    });
}

export const generateSignature = (params, token) => {
    const keys = Object.keys(params);
    keys.sort((a, b) => a.localeCompare(b));
    let stringForEncode = keys.reduce((acc, val) => {
        return acc + `${val}=${encodeRfc3986(params[val])}&`;
    }, '')
    stringForEncode += `token=${token}`;
    return md5(stringForEncode);
}
