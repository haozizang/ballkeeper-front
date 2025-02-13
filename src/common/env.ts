export const DEV_PROXY = {
    target: 'http://172.20.84.37:8888',
    prefix: '/ballkeeper'
};

export const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return DEV_PROXY.target;
    }
    return DEV_PROXY.prefix;
};