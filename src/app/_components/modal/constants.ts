import { createContext } from 'react';

import type { EditorModalState } from './types';

export const EditorModalContext = createContext<EditorModalState | null>(null);
