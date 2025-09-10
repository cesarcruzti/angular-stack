export interface CommandProgress {
    expected: number;
    pending: number;
    running: number;
    processed: number;
    failed: number;
    start: number;
    end: number;
}