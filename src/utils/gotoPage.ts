(function(root: any):void {

    root.gotoPage = function(pageName: string): void {
        let url = `../${pageName}/index.html`;
        if ("index" === pageName) {
            url = window.location.origin + "/index.html";
        }

        window.location.href = url;
    };

})(this);
