declare module "*.hbs" {
    import { TemplateDelegate } from "handlebars";

    declare const template: TemplateDelegate;

    export default template;
}


/*declare module "handlebars/dist/handlebars.runtime" {
    import Handlebars from "handlebars/dist/handlebars.runtime";

    declare const handlebars: Handlebars;

    export default handlebars;
}*/

declare module "*.hbs" {
    import { TemplateDelegate } from "handlebars";
  
    declare const template: TemplateDelegate;
  
    export default template;
  }
