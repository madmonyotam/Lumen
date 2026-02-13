"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brain_1 = require("./brain");
describe('processBiometrics', () => {
    test('should calculate correct metrics for calm state', () => {
        const result = (0, brain_1.processBiometrics)(70, 0.2, 50);
        expect(result.biometrics.bpm).toBe(70);
        expect(result.biometrics.stressIndex).toBe(0.2);
        expect(result.status.homeostasisLabel).toBe("STABLE");
        expect(result.status.mode).toBe("DEEP REFLECTION");
        expect(result.visualParams.coreColor).toBe("#00f2c3");
    });
    test('should detect high stress state', () => {
        const result = (0, brain_1.processBiometrics)(90, 0.8, 30);
        expect(result.status.homeostasisLabel).toBe("AGITATED");
        expect(result.status.mode).toBe("HIGH ALERT");
        expect(result.visualParams.coreColor).toBe("#ff4d4d");
    });
    test('should detect high physical activity', () => {
        const result = (0, brain_1.processBiometrics)(120, 0.4, 60);
        expect(result.status.homeostasisLabel).toBe("ACTIVE");
        expect(result.status.mode).toBe("PHYSICAL EXERTION");
        expect(result.visualParams.coreColor).toBe("#ffaa00");
    });
});
