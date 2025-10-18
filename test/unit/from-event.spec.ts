import {describe, expect, it} from "vitest";
import {fromEvent} from "../../src/generators/from-event.js";

describe('fromEvent', () => {
    it('should get events', async () => {
        const target = new EventTarget();
        await using eventsStream = fromEvent(target, 'click');
        setTimeout(() => target.dispatchEvent(new Event('click')), 10);
        setTimeout(() => target.dispatchEvent(new Event('click')), 20);
        setTimeout(() => target.dispatchEvent(new Event('click')), 30);
        const events: Event[] = [];
        for await (const event of eventsStream) {
            events.push(event);
            if (events.length === 3) {
                break;
            }
        }
        expect(events.length).toEqual(3);
    });
});
