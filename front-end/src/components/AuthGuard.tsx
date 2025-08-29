"use client";

import { useEffect, ReactNode } from "react";
import Loading from "./Loading";
import { useState } from "react";
interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const loginInfo = localStorage.getItem("user-info");
    if (!loginInfo) {
      window.location.href = "/";
    }else {
      setChecking(false);
    }
  }, []);
  if (checking) {
    return <Loading />; 
  }
  return <>{children}</>;
}
