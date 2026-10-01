import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import React from "react";

export interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

export const RowContext = React.createContext<RowContextProps>({});