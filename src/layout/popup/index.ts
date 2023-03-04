import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type Size = {
    width: number;
    height: number;
}

export default class Popup extends _Block {
    private ident: number = 10;

    protected getCompileOptions() {
        return { template, styles };
    }

    private toPx(value: number) {
        return String(value) + "px";
    }

    private getSize(element: Element): Size {          
        const thisRect = element.getBoundingClientRect();
        return { width: thisRect.width, height: thisRect.height };
    }

    _checkRect(contRect: DOMRect, size: Size, top: number, left: number) {
        const xOk = size.width + left <= (contRect.right - contRect.x);
        const yOk = size.height + top <= (contRect.bottom - contRect.y);
        return xOk && yOk;
    }

    show(parent?: Element) {
        const element = this.getElement();
        if (!parent || !element) return;
        
        element.style.visibility = "hidden";

        super.show();       

        const parentRect = parent.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const size = this.getSize(element);
        const ident = this.ident;

        let position = { top: parentRect.top + parentRect.width / 2, left: parentRect.left };

        const maxBottom = parentRect.bottom + ident + size.height;
        const minTop = parentRect.top - ident - size.height;


        if (maxBottom >= bodyRect.bottom) {
            position.top = minTop;
        }
        else if (minTop <= bodyRect.top) {
            position.top = maxBottom - size.height;
        }

        element.style.top = this.toPx(position.top);
        element.style.left = this.toPx(position.left);
        element.style.visibility = "";
    }

}
