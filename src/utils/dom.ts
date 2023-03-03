// менаем родителя у узлов
export function moveChilds(newParent: Element, oldParent: Element): void {

    while (oldParent.childNodes.length > 0) {
        newParent.appendChild(oldParent.childNodes[0]);
    }

}
