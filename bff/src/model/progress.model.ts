export interface Progress {
    pending: number;
    running: number;
    processed: number;
    failed: number;
    start: number;
    end: number;
}