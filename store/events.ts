import { create } from "zustand";

interface Event<T> {
    name: string;
    data: T;
}

interface IEventStore {
    event: Event<any> | null;
    send: (event: Event<any>) => void;
    clear: () => void;
}

export const useEventStore = create<IEventStore>()((set) => ({
    event: null,
    send: (event: Event<any>) => set({ event: event }),
    clear: () => set({ event: null }),
}));

export default useEventStore;
