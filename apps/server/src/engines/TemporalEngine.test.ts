import { TemporalEngine } from './TemporalEngine';
import { LumenPersona } from '@lumen/shared/types/index';

describe('TemporalEngine', () => {
    let engine: TemporalEngine;

    beforeEach(() => {
        engine = new TemporalEngine();
        const mockPersona: LumenPersona = {
            core: {
                name: "Test",
                gender: "non-binary",
                language: "en",
                lifespan: 24 * 60 * 60 * 1000
            },
            traits: {} as any,
            internal: {} as any,
            strengths: []
        };
        engine.reborn({
            persona: mockPersona
        });
    });

    test('should progress normally at 60 BPM and 0 stress', () => {
        const start = engine.getSubjectiveTime();
        const next = engine.calculateSubjectiveTime(60, 0, 1000); // 1 sec real time
        const diff = next - start;

        // 60/60 * (1 + 0) = 1.0 factor
        expect(diff).toBeCloseTo(1000);
    });

    test('should accelerate time under stress and high BPM', () => {
        const start = engine.getSubjectiveTime();
        // 120 beats / 60 = 2.0
        // Stress 1.0 -> factor 1.5
        // Total factor = 3.0
        const next = engine.calculateSubjectiveTime(120, 1.0, 1000);
        const diff = next - start;

        expect(diff).toBeCloseTo(3000); // 3x speed relative to real time
    });

    test('should slow down time (min factor) at low BPM', () => {
        const start = engine.getSubjectiveTime();
        // 30 beats / 60 = 0.5
        // Stress 0 -> 1.0
        // Total factor = 0.5
        const next = engine.calculateSubjectiveTime(30, 0, 1000);
        const diff = next - start;

        expect(diff).toBeCloseTo(500); // 0.5x speed
    });
});
