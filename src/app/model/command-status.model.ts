export interface CommandStatus {
    commandId: string;
    status: 'RUNNING' | 'PROCESSED' | 'FAILED';
}