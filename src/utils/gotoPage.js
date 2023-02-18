global.gotoPage = function gotoPage(pageName) {
    let url = `../${pageName}/index.html`;
    if (pageName === "index") {
        url = `${global.location.origin}/index.html`;
    }

    global.location.href = url;
};
