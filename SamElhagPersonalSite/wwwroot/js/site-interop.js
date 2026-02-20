window.siteInterop = {
    getSessionFlag: function (key) { return sessionStorage.getItem(key) === 'true'; },
    setSessionFlag: function (key) { sessionStorage.setItem(key, 'true'); },
    reloadPage: function () { location.reload(); }
};
