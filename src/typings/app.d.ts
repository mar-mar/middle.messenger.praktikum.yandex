
interface Func<T = void, Args = any> {
    ([...args]: Args[]): T;
}

type DOMEventHandler = (evt: Event) => void;

type FunctionNoArgsNoReturn = () => void;


type MenuItemTemplateProps = {
    label: string;
    click?: DOMEventHandler;
}

type RequireKeys<T extends object, K extends keyof T> =
  (Required<Pick<T, K>> & Omit<T, K>) extends
  infer O ? { [P in keyof O]: O[P] } : never;

type PlainObject = Record<string, unknown>;

