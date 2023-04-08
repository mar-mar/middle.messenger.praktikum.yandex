type AnyFunction = (...args: any) => any;

type AnyFunctionNoReturn = (...args: any) => void;

type EventHandler = (evt: Event) => void;

type FunctionNoArgsNoReturn = () => void;

type RecordStrAny = Record<string, any>;

type MenuItemTemplateProps = {
    label: string;
    click?: EventHandler;
}

type RequireKeys<T extends object, K extends keyof T> =
  (Required<Pick<T, K>> & Omit<T, K>) extends
  infer O ? { [P in keyof O]: O[P] } : never;
