import React from "react";
import { FormInstance } from "./types";

export const EditableContext = React.createContext<FormInstance<any> | null>(null);