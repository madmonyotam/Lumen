
async function verifyIdentity() {
    const baseUrl = 'http://localhost:3001';

    console.log("1. Rebirthing Entity as 'Kratos' (Traits: Aggressive, Stoic)...");
    try {
        const genesisRes = await fetch(`${baseUrl}/api/genesis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Kratos",
                gender: "male",
                traits: ["Aggressive", "Stoic", "War-hardened"],
                lifespan: 86400000
            })
        });

        const genesisData = await genesisRes.json();
        console.log("Genesis Status:", genesisRes.status);
        console.log("Genesis Response:", JSON.stringify(genesisData, null, 2));
    } catch (e) {
        console.error("Genesis Failed:", e.message);
        return;
    }

    // Wait a moment for server state to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("\n2. Sending Message to trigger thought...");
    try {
        const chatRes = await fetch(`${baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "What is your purpose?"
            })
        });

        const chatData = await chatRes.json();
        console.log("Chat Status:", chatRes.status);
        console.log("Chat Response:", JSON.stringify(chatData, null, 2));
    } catch (e) {
        console.error("Chat Failed:", e.message);
    }

    console.log("\nCheck server console for thoughts filtering through 'Aggressive/Stoic' traits.");
}

verifyIdentity();
