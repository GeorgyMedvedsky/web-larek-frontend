interface Modal {
    state: boolean;

    open: (state: boolean) => void;
    close: (state: boolean) => void;
}