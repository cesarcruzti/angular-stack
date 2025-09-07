export interface CommandProgress {
    pending: number;
    running: number;
    processed: number;
    failed: number;
    start: number;
    end: number;
}