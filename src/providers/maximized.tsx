import { Dispatch, SetStateAction, createContext } from "react";

interface MaximizedContextInterface {
  maximized: boolean;
  setMaximized: Dispatch<SetStateAction<boolean>>;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const MaximizedContext = createContext<MaximizedContextInterface>({ maximized: false, setMaximized: () => {} });