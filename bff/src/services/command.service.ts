import { sendMessages } from '../config/kafka';
import { PaperRange } from '../model/paper-range.model';
import { updateProgress } from '../repositories/response.repository';

export const sendCommand = async (paperRanges: PaperRange[], headers: any) => {
    if (paperRanges.length > 0) {
        let start = Date.now();    
        await sendMessages(paperRanges, headers);
        updateProgress({pending: paperRanges.length, running: 0, processed: 0, failed: 0, start, end: start, expected: paperRanges.length });
    }
}