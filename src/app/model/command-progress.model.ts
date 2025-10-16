export interface CommandProgress {
    expected: number;
    pending: number;
    running: number;
    processed: number;
    failed: number;
    start: number;
    end: number;
}

export const createInitialProgress = (): CommandProgress => ({
    expected: 0,
    pending: 0,
    running: 0,
    processed: 0,
    failed: 0,
    start: 0,
    end: 0,
});