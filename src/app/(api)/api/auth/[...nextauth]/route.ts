// app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/app/auth"; // Bir önceki adımda oluşturduğumuz auth.ts dosyasından alıyoruz.
export const { GET, POST } = handlers;