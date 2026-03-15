import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')))
  try {
    const setting = await (prisma as any).setting.findFirst()
    console.log('Setting found:', setting)
  } catch (e: any) {
    console.error('Error finding setting:', e.message)
  }
}

main().finally(() => prisma.$disconnect())
