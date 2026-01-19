/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Fetching latest users from Supabase...')
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        })

        if (users.length === 0) {
            console.log('No users found in the database.')
        } else {
            console.table(users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                createdAt: u.createdAt
            })))
        }
    } catch (error) {
        console.error('Error fetching users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
