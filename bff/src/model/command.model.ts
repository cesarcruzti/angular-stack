export interface Command {
    commandId: string;
    initialEntity: number;
    finalEntity: number;
    referenceDate: number;
    traceparent: string|undefined;
    correlationid: string|undefined;
}