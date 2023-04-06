import { isHTMLTextAreaElement } from "../../utils/helpers/typeCheck";
import { Props, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type SimpleTextAreaProps = {
    label: string;
    value?: string;
    name?: string;
    events?: {
        focus?: () => void;
        blur?: () => void;
    };
};

export default class SimpleTextArea extends _Block<SimpleTextAreaProps> {

    constructor(props: Props<SimpleTextAreaProps>) {
        props = props || {};
        props.events = props.events || {};

        props.events.keydown = (evt) => { _this.onKeyDown(evt); }; // todo в init?
        super(props);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
    }

    protected getCompileOptions() {
        return { 
            template,
            styles
        };
    }

    onKeyDown(evt: KeyboardEvent) {

        if (evt.key == "Enter" && !evt.shiftKey) {

            evt.preventDefault();

            const newEvent = new Event("submit", {cancelable: true});

            const form = (this.getElement() as HTMLTextAreaElement).form;
            form?.dispatchEvent(newEvent);
        }
    }

    getValue() {
        const element = this.getElement();
        return isHTMLTextAreaElement(element) ? element.value : null;
    }
}
