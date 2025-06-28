// app/profilim/page.tsx
import { auth } from "@/app/auth";
import Image from "next/image";

export default async function ProfilSayfasi() {
  const session = await auth(); // Sunucu tarafında oturum bilgisini almak için

  if (!session?.user) {
    // Bu normalde middleware tarafından yakalanır ama ek bir güvenlik katmanı.
    return <p>Bu sayfayı görmek için giriş yapmalısınız.</p>;
  }

  return (
    <div>
      <h1>Merhaba, {session.user.name}!</h1>
      <p>E-posta adresin: {session.user.email}</p>
      <Image 
         src={session.user.image || '/default-avatar.png'}
         alt="Profil Fotoğrafı"
         width={100}
         height={100}
      />
    </div>
  );
}