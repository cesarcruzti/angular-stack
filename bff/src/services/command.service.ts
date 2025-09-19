import { Command } from '../model/command.model';
import { PaperRange } from '../model/paper-range.model';
import { insertCommands, truncateCommands } from '../repositories/command.repository';
import { updateProgress } from '../repositories/progress.repository';
import { v4 as uuidv4 } from 'uuid';
import { daysSinceEpoch } from '../utils/datetime';

export const saveCommands = async (paperRanges: PaperRange[],
    traceparent: string | undefined,
    correlationid: string | undefined) => {

    if (paperRanges.length > 0) {
        let start = Date.now();
        const referenceDate = daysSinceEpoch();
        await updateProgress({
            pending: paperRanges.length,
            running: 0, processed: 0, failed: 0,
            start, end: start,
            expected: paperRanges.length
        });

        let commands = paperRanges.map((range) => {
            const message: Command = {
                commandId: uuidv4(),
                initialEntity: range.initialEntity,
                finalEntity: range.finalEntity,
                referenceDate,
                traceparent,
                correlationid
            }
            return message;
        });
        await truncateCommands();
        await insertCommands(commands);
    }
}