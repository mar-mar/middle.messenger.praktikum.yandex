import { isHTMLTextAreaElement } from "../../utils/helpers/typeCheck";
import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface SimpleTextAreaProps extends BlockProps { 
    label: string;
    value?: string;
    name?: string;
    events?: {
        focus?: EventListener;
        blur?: EventListener;
        keydown?: EventListener;
    };
}

export default class SimpleTextArea<T extends SimpleTextAreaProps = SimpleTextAreaProps> extends _Block<T> {

    override prepareProps(props: T) {
        const events = props.events ?? {};
        events.keydown = this.onKeyDown.bind(this);
        return props;
    }

    override getCompileOptions() {
        return { 
            template,
            styles
        };
    }

    onKeyDown(evt: Event) {
        const keyEvent = evt as KeyboardEvent;

        if (keyEvent.key == "Enter" && !keyEvent.shiftKey) {

            evt.preventDefault();

            const newEvent = new Event("submit", {cancelable: true});

            const form = (this.getElement() as HTMLTextAreaElement).form;
            form?.dispatchEvent(newEvent);
        }
    }

    getValue(): string | undefined {
        const element = this.getElement();
        return isHTMLTextAreaElement(element) ? element.value : undefined;
    }
}
