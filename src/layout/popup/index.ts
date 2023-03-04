import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type Size = {
    width: number;
    height: number;
}

export default class Popup extends _Block {
    private ident: number = 10;


    private toggleWatchBodyClick(value: boolean): void {
        const options = { capture: true, passive: true };
        document.body.removeEventListener("click", this.onBodyClick, options);
        if (!value) return;

        document.body.addEventListener("click", this.onBodyClick, options);
    }

    private onBodyClick = () => {
        this.hide();
    }

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

    public show(parent?: Element): void {
        const element = this.getElement();
        if (!parent || !element) return;
        
        const oldVisibility = element.style.visibility;
        element.style.visibility = "hidden";
        super.show();   
        //

        const parentRect = parent.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        const size = this.getSize(element);
        const ident = this.ident;

        let position = { top: parentRect.top + parentRect.width / 2, left: parentRect.left };

        position.top = this.getPositionByAxis(bodyRect, parentRect, ident, size, true);
        position.left = this.getPositionByAxis(bodyRect, parentRect, 0, size, false);

        element.style.top = this.toPx(position.top); //  + window.scrollY
        element.style.left = this.toPx(position.left); // + window.scrollX
        //
        element.style.visibility = oldVisibility;
        this.toggleWatchBodyClick(true);
    }

    private getPositionByAxis(bodyRect: DOMRect, parentRect: DOMRect, ident: number, size: Size, axisY: boolean): number {
        const sizeByAxis = axisY ? size.height : size.width;
        const bodyBound = this.getBoundByAxis(axisY, bodyRect);
        const parentBound = this.getBoundByAxis(axisY, parentRect);
        if (!axisY) {
            parentBound.reverse(); // когда по X, не учитываем размер родителя, todo может от центра сделать привызку?
        }
        const maxBottom = parentBound[0] + ident + sizeByAxis;
        const minTop = parentBound[1] - ident - sizeByAxis;
    
        let result: number = maxBottom - sizeByAxis; 
        if (maxBottom >= bodyBound[0]) {
            result = minTop;
        }
        else if (minTop <= bodyBound[1]) {
            result = maxBottom - sizeByAxis;
        }

        return result;
    }

    private getBoundByAxis(axisY: boolean, rect: DOMRect) {
        return axisY ? [rect.bottom, rect.top] : [rect.right, rect.left]; 
    }


    public hide(): void {
        this.toggleWatchBodyClick(false);
        super.hide();
    }

}
