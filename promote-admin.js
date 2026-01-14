const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
    console.log("Please provide an email address as an argument.");
    process.exit(1);
}

async function main() {
    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'ADMIN' },
        });
        console.log(`Successfully promoted ${user.email} to ADMIN.`);
    } catch (e) {
        if (e.code === 'P2025') {
            console.log(`User with email ${email} not found.`);
        } else {
            console.error('ERROR:', e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
