"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoogleLoginPreview() {
  const [showMessage, setShowMessage] = useState(false);
  return <><Button className="auth-google" variant="secondary" aria-describedby="google-status" onClick={() => setShowMessage(true)}><span className="auth-google-letter" aria-hidden="true">G</span> Masuk dengan Google</Button><p className="auth-google-status" id="google-status" role={showMessage ? "status" : undefined}><LockKeyhole size={16} aria-hidden="true" /><span>{showMessage ? "Autentikasi Google belum diaktifkan. Untuk mencoba tampilan aplikasi, silakan gunakan Mode Preview." : "Autentikasi Google belum dihubungkan. Gunakan Mode Preview untuk menjelajahi aplikasi."}</span></p></>;
}
