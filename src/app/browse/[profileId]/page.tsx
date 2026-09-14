"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { SkzCatalog } from "@/components/SkzCatalog";
import FriendsCatalog from "@/components/FriendsCatalog";
import { HritikaCatalog } from "@/components/HritikaCatalog";
import { PROFILES } from "@/components/ProfileSelection";

export default function CatalogPage() {
  const router = useRouter();
  const params = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const isUnlocked = localStorage.getItem('surprise_unlocked');
    if (isUnlocked !== 'true') {
      router.push('/');
    } else {
      setIsAuthorized(true);
      
      const profileId = params.profileId as string;
      const foundProfile = PROFILES.find(p => p.id === profileId);
      if (foundProfile) {
        setProfile(foundProfile);
      } else {
        router.push('/browse');
      }
    }
  }, [router, params.profileId]);

  if (!isAuthorized || !profile) {
    return <div className="min-h-screen bg-netflix-black flex items-center justify-center" />;
  }

  return (
    <main className="min-h-screen bg-netflix-black text-white">
      {profile.id === 'her' ? (
        <HritikaCatalog profile={profile} />
      ) : profile.id === 'skz' ? (
        <SkzCatalog />
      ) : profile.id === 'friends' ? (
        <FriendsCatalog />
      ) : (
        <Catalog profile={profile} />
      )}
    </main>
  );
}
