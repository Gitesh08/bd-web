"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileSelection } from "@/components/ProfileSelection";

export default function BrowsePage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isUnlocked = localStorage.getItem('surprise_unlocked');
    if (isUnlocked !== 'true') {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleSelectProfile = (profile: any) => {
    router.push(`/browse/${profile.id}`);
  };

  if (!isAuthorized) {
    return <div className="min-h-screen bg-netflix-black flex items-center justify-center" />;
  }

  return (
    <main className="min-h-screen bg-netflix-black text-white">
      <ProfileSelection onSelectProfile={handleSelectProfile} />
    </main>
  );
}
