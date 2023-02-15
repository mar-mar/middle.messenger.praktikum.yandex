(function(root) {

    root.gotoPage = function(pageName) {
        let url = `../${pageName}/index.html`;
        if ("index" === pageName) {
            url = window.location.origin + "/index.html";
        }

        window.location.href = url;
    };

})(this);
