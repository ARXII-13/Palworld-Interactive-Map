export {};

declare global {
    interface Window {
        electron: {
            pickFolder: () => Promise<string | null>;
            saveSettings: (settings: any) => Promise<void>;
            loadSettings: () => Promise<any | null>;
        };
    }
}
