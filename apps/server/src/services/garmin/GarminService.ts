
export class GarminService {
    private isConnected: boolean = false;

    async connect(): Promise<boolean> {
        console.log("Connecting to Garmin API...");
        // Mock connection delay
        await new Promise(resolve => setTimeout(resolve, 500));
        this.isConnected = true;
        console.log("Garmin API Connected (MOCK).");
        return true;
    }

    async fetchLatestHeartRate(): Promise<number> {
        if (!this.isConnected) throw new Error("Garmin Service not connected");
        // Return random BPM between 60 and 100
        return 60 + Math.random() * 40;
    }

    async fetchStress(): Promise<number> {
        if (!this.isConnected) throw new Error("Garmin Service not connected");
        // Return random stress between 0 and 100 which we normalize to 0-1
        return Math.random();
    }

    async fetchHRV(): Promise<number> {
        if (!this.isConnected) throw new Error("Garmin Service not connected");
        // Return random HRV between 20 and 100
        return 20 + Math.random() * 80;
    }
}
