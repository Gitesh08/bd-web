"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FamilyCatalog from "@/components/FamilyCatalog";

export default function FamilyPage() {
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

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center" />;
  }

  return <FamilyCatalog />;
}
