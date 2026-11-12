import { Check, CornerDownRight, LockKeyhole, MessageSquareText, Package, ShieldCheck, TriangleAlert } from "lucide-react";

/** A non-interactive illustration, deliberately separate from the future scenario engine. */
export function SimulationPreview() {
  return (
    <div className="landing-simulation-wrap">
      <div className="landing-simulation-caption"><span /> ILUSTRASI SIMULASI</div>
      <div className="landing-simulation">
        <div className="landing-simulation-top">
          <div className="landing-chat-avatar"><Package size={21} aria-hidden="true" /></div>
          <div><strong>Pesan dari kurir?</strong><span>Kenali tanda penipuan digital</span></div>
          <MessageSquareText size={20} aria-hidden="true" />
        </div>
        <div className="landing-chat-body">
          <span className="landing-chat-time">CONTOH PERCAKAPAN</span>
          <div className="landing-chat-bubble">
            <p>Halo, paket kamu tertahan. Silakan buka file ini untuk konfirmasi alamat pengiriman.</p>
            <div className="landing-attachment"><Package size={19} aria-hidden="true" /><span>Resi_Pengiriman.apk<small>File aplikasi · sumber tidak dikenal</small></span><TriangleAlert size={17} aria-hidden="true" /></div>
            <span className="landing-message-time">10.24</span>
          </div>
          <div className="landing-decision-label"><CornerDownRight size={16} aria-hidden="true" /><strong>Apa langkah yang paling aman?</strong></div>
          <div className="landing-choice"><span>A</span>Membuka file untuk mengecek paket</div>
          <div className="landing-choice landing-choice-safe"><span>B</span>Memeriksa melalui aplikasi resmi<Check size={17} aria-hidden="true" /></div>
          <p className="landing-illustration-note"><LockKeyhole size={12} aria-hidden="true" /> Contoh tampilan, bukan simulasi aktif</p>
        </div>
      </div>
      <div className="landing-safety-note"><div><ShieldCheck size={23} aria-hidden="true" /></div><p><strong>Berhenti sejenak. Periksa dulu.</strong><span>Keputusan kecil, perlindungan besar.</span></p></div>
    </div>
  );
}
