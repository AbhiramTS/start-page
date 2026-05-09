import { createContext, useContext, ReactNode } from "react";
import { usePreferences } from "../hooks/usePreferences";

type PreferencesContextType = ReturnType<typeof usePreferences>;

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
	const preferences = usePreferences();
	return (
		<PreferencesContext.Provider value={preferences}>
			{children}
		</PreferencesContext.Provider>
	);
}

export function useSharedPreferences() {
	const context = useContext(PreferencesContext);
	if (!context) {
		throw new Error(
			"useSharedPreferences must be used within PreferencesProvider",
		);
	}
	return context;
}
