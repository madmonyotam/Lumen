"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TemporalEngine_1 = require("./TemporalEngine");
describe('TemporalEngine', () => {
    let engine;
    beforeEach(() => {
        engine = new TemporalEngine_1.TemporalEngine();
        const mockPersona = {
            core: {
                name: "Test",
                gender: "non-binary",
                language: "en",
                lifespan: 24 * 60 * 60 * 1000
            },
            traits: {},
            internal: {},
            strengths: []
        };
        let state = { isAlive: false, age: 0, lifespan: 100000000 };
        state = engine.reborn(state, {
            persona: mockPersona
        });
    });
    test('should progress normally at 60 BPM and 0 stress', () => {
        let state = { isAlive: true, age: 0, lifespan: 1000 };
        const start = engine.getSubjectiveTime(state);
        state = engine.calculateSubjectiveTime(state, 60, 0, 1000); // 1 sec real time
        const next = engine.getSubjectiveTime(state);
        const diff = next - start;
        // 60/60 * (1 + 0) = 1.0 factor
        expect(diff).toBeCloseTo(1000);
    });
    test('should accelerate time under stress and high BPM', () => {
        let state = { isAlive: true, age: 0, lifespan: 10000 };
        const start = engine.getSubjectiveTime(state);
        // 120 beats / 60 = 2.0
        // Stress 1.0 -> factor 1.5
        // Total factor = 3.0
        state = engine.calculateSubjectiveTime(state, 120, 1.0, 1000);
        const next = engine.getSubjectiveTime(state);
        const diff = next - start;
        expect(diff).toBeCloseTo(3000); // 3x speed relative to real time
    });
    test('should slow down time (min factor) at low BPM', () => {
        let state = { isAlive: true, age: 0, lifespan: 10000 };
        const start = engine.getSubjectiveTime(state);
        // 30 beats / 60 = 0.5
        // Stress 0 -> 1.0
        // Total factor = 0.5
        state = engine.calculateSubjectiveTime(state, 30, 0, 1000);
        const next = engine.getSubjectiveTime(state);
        const diff = next - start;
        expect(diff).toBeCloseTo(500); // 0.5x speed
    });
});
