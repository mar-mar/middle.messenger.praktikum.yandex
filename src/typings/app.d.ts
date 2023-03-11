type AnyFunction = (...args: any) => any;

type AnyFunctionNoReturn = (...args: any) => void;

type EventHandler = (evt: Event) => void;

type FunctionNoArgsNoReturn = () => void;

type MenuItemTemplateProps = {
    label: string;
    click?: EventHandler;
}
