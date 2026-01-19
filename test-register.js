/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Registering Test User...')
    try {
        const user = await prisma.user.create({
            data: {
                name: 'Supabase Test User',
                email: 'test' + Date.now() + '@example.com',
                password: 'password123', // In a real app we'd hash it, but this is for connectivity testing
                role: 'SEEKER'
            }
        })
        console.log('✅ Success! User created with ID:', user.id)
    } catch (error) {
        console.error('❌ Error creating user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
