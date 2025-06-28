import { PrismaClient } from '@prisma/client'

// Bu kısım, geliştirme ortamında sürekli yeni Prisma Client'ı oluşturulmasını
// engelleyerek 'hot-reloading' sırasında oluşabilecek hataları önler.
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// globalThis.prisma'yı kontrol eder, varsa onu kullanır, yoksa yenisini oluşturur.
const prisma = globalThis.prisma ?? prismaClientSingleton()

export { prisma } // prisma'yı export ediyoruz, istersen default export da yapabilirsin

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma