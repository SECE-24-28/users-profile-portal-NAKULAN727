import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('Admin@123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: { email: 'admin@school.com', password: hash, role: Role.ADMIN },
  })
  console.log('Seed complete: admin@school.com / Admin@123')
}

main().finally(() => prisma.$disconnect())
