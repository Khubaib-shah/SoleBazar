import { prisma } from './src/lib/prisma';

async function test() {
    try {
        console.log("Checking prisma available models...");
        const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
        console.log("Models:", models);
        
        if (!(prisma as any).setting) {
            console.error("❌ 'setting' model missing from prisma object");
            return;
        }

        console.log("Attempting to findFirst setting...");
        const settings = await (prisma as any).setting.findFirst();
        console.log("Settings found:", settings);
    } catch (e: any) {
        console.error("❌ Error during test:", e);
        if (e.message) console.error("Message:", e.message);
        if (e.code) console.error("Code:", e.code);
    }
}

test();
