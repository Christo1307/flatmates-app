"use server"

import bcrypt from "bcryptjs"
import db from "@/lib/db"
import { z } from "zod"

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
})

export async function register(formData: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(formData)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }

    const { email, password, name } = validatedFields.data

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    })

    if (existingUser) {
        return { error: "Email already in use!" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    return { success: "User created!" }
}
