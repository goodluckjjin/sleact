import { useCallback, useState, Dispatch, SetStateAction, ChangeEvent } from "react";

type ReturnTypes<T = ChangeEvent<HTMLInputElement>> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState<T>(initialData);
  const handler = useCallback((e: any): void => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
