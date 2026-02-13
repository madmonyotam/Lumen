import { GarminService } from './GarminService';

describe('GarminService', () => {
    let service: GarminService;

    beforeEach(() => {
        service = new GarminService();
    });

    test('should connect successfully', async () => {
        const result = await service.connect();
        expect(result).toBe(true);
    });

    test('should throw error if fetching data before connect', async () => {
        await expect(service.fetchLatestHeartRate()).rejects.toThrow("Garmin Service not connected");
    });

    test('should fetch data after connect', async () => {
        await service.connect();
        const bpm = await service.fetchLatestHeartRate();
        expect(bpm).toBeGreaterThanOrEqual(60);
        expect(bpm).toBeLessThanOrEqual(100);

        const stress = await service.fetchStress();
        expect(stress).toBeGreaterThanOrEqual(0);
        expect(stress).toBeLessThanOrEqual(1);
    });
});
