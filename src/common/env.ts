export const DEV_PROXY = {
    target: 'http://172.30.144.9:8888',
    prefix: '/ballkeeper'
};

export const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return DEV_PROXY.target;
    }
    return DEV_PROXY.prefix;
};

export const ONE_TEAM_LIMIT = false;