import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Use these custom hooks throughout your app instead of plain `useDispatch` and `useSelector`.
// They automatically know about all your state (like state.auth, state.analysis) without needing extra types!
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
