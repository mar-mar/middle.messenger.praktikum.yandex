import { _Block } from "../../utils/_Block";
import template from "./home.hbs";

export default class HomePage extends _Block {
    
    protected render() {
        return this.compile(template, {});
    }
}