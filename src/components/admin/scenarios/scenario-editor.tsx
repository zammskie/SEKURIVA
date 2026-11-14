"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import type {
  DecisionNode,
  EndingNode,
  MessageNode,
  RiskLevel,
  Scenario,
  ScenarioCategory,
  ScenarioChoice,
  ScenarioNode,
  ScenarioSpeaker,
  ScenarioStatus,
} from "@/lib/scenario-engine/foundation-types";
import { localScenarioRepository } from "@/lib/scenario-engine/local-scenario-repository";
import { validateScenarioGraph } from "@/lib/scenario-engine/validate-graph";
import { MATERIAL_CATEGORIES } from "@/lib/materials/types";
import { ScenarioPreviewModal } from "./scenario-preview-modal";
import { ScenarioGraphVisualizer } from "./scenario-graph-visualizer";

const ALL_CATEGORIES: ScenarioCategory[] = [
  "Penawaran pekerjaan",
  "Tugas online",
  "Penyamaran kurir",
  "File aplikasi",
  "Transaksi digital",
  "Customer service",
  "Investasi",
  "Pemulihan dana",
];

const SPEAKERS: ScenarioSpeaker[] = ["Pelaku", "Siswa", "Narator", "Sistem"];
const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high"];

function createBlankScenario(): Scenario {
  const date = new Date().toISOString();
  return {
    id: `skenario-${Date.now()}`,
    slug: `skenario-baru-${Date.now()}`,
    title: "",
    category: "Penawaran pekerjaan",
    description: "",
    context: "",
    keywords: ["keamanan", "penipuan"],
    learningObjectives: [""],
    relatedMaterials: ["Dasar Kesadaran Keamanan Digital"],
    difficulty: "Dasar",
    estimatedDurationMinutes: 10,
    status: "draft",
    createdAt: date,
    updatedAt: date,
    startNodeId: "open-1",
    nodes: [
      { id: "open-1", type: "message", speaker: "Narator", content: "Pesan pembuka simulasi.", nextNodeId: "dec-1" },
      {
        id: "dec-1",
        type: "decision",
        prompt: "Bagaimana keputusan pertamamu?",
        choices: [
          {
            id: "c1-a",
            label: "Pilihan aman",
            response: "Saya memilih untuk memverifikasi.",
            responseSpeaker: "Siswa",
            consequence: { title: "Tindakan Aman", description: "Kamu memutus risiko sedini mungkin.", riskLevel: "low" },
            nextNodeId: "dec-2a",
          },
          {
            id: "c1-b",
            label: "Pilihan berisiko",
            response: "Saya langsung percaya tawaran ini.",
            responseSpeaker: "Siswa",
            consequence: { title: "Masuk Jebakan", description: "Pelaku melanjutkan manipulasi.", riskLevel: "high" },
            nextNodeId: "dec-2b",
          },
        ],
      },
      {
        id: "dec-2a",
        type: "decision",
        prompt: "Keputusan lanjutan pada cabang A?",
        choices: [
          {
            id: "c2a-1",
            label: "Tutup percakapan",
            response: "Saya hentikan komunikasi.",
            consequence: { title: "Aman", description: "Terhindar dari penipuan.", riskLevel: "low" },
            nextNodeId: "end-safe",
          },
          {
            id: "c2a-2",
            label: "Mencoba sedikit",
            response: "Saya coba sedikit dulu.",
            consequence: { title: "Risiko Sedang", description: "Sedikit terpapar.", riskLevel: "medium" },
            nextNodeId: "end-mixed",
          },
        ],
      },
      {
        id: "dec-2b",
        type: "decision",
        prompt: "Keputusan lanjutan pada cabang B?",
        choices: [
          {
            id: "c2b-1",
            label: "Sadar dan mundur",
            response: "Saya sadar ini mencurigakan.",
            consequence: { title: "Menghindari Kerugian Lebih Besar", description: "Berhenti sebelum terlambat.", riskLevel: "low" },
            nextNodeId: "end-mixed",
          },
          {
            id: "c2b-2",
            label: "Teruskan proses",
            response: "Saya teruskan.",
            consequence: { title: "Terkena Penipuan", description: "Kerugian disimulasikan.", riskLevel: "high" },
            nextNodeId: "end-risky",
          },
        ],
      },
      { id: "end-safe", type: "ending", title: "Berhasil Menghindari Penipuan", content: "Kamu berhasil mengamankan diri." },
      { id: "end-mixed", type: "ending", title: "Menyadari Tanda Bahaya", content: "Kamu sempat ragu namun berhasil berhenti." },
      { id: "end-risky", type: "ending", title: "Terpapar Risiko Penipuan", content: "Kamu mengalami konsekuensi simulatif." },
    ],
    learning: {
      summary: "Ringkasan edukatif dari skenario ini.",
      conclusion: "Kesimpulan pembelajaran utama.",
      redFlags: [
        { id: "rf-1", title: "Tekanan Waktu", description: "Pelaku membatasi waktu.", nodeId: "open-1" },
        { id: "rf-2", title: "Iming-iming Tidak Wajar", description: "Janji imbalan berlebihan.", nodeId: "dec-1" },
        { id: "rf-3", title: "Identitas Tidak Jelas", description: "Sumber kontak mencurigakan.", nodeId: "dec-2a" },
        { id: "rf-4", title: "Permintaan Biaya di Muka", description: "Uang diminta sebelum bekerja.", nodeId: "dec-2b" },
      ],
      socialEngineeringTactics: [
        { title: "Urgensi Buatan", description: "Menciptakan kepanikan.", nodeId: "open-1" },
        { title: "Keserakahan (Greed)", description: "Memanfaatkan keinginan cepat kaya.", nodeId: "dec-1" },
      ],
      safeActions: [
        "Selalu periksa identitas pihak yang menghubungi.",
        "Jangan mentransfer uang sebagai syarat bekerja.",
        "Gunakan saluran komunikasi resmi yang dicari sendiri.",
      ],
      choiceAnalyses: {
        "c1-a": { why: "Verifikasi menghentikan skenario buruk.", possibleImpact: "Aman.", saferAction: "Cek kanal resmi.", lesson: "Penting memverifikasi." },
        "c1-b": { why: "Mempermudah pelaku menipu.", possibleImpact: "Tertipu.", saferAction: "Tunda keputusan.", lesson: "Jangan terburu-buru." },
        "c2a-1": { why: "Memutus kontak.", possibleImpact: "Data aman.", saferAction: "Blokir nomor.", lesson: "Tutup percakapan mencurigakan." },
        "c2a-2": { why: "Rasa penasaran.", possibleImpact: "Bisa tertipu.", saferAction: "Tolak tegas.", lesson: "Waspada mencoba hal mencurigakan." },
        "c2b-1": { why: "Sadar tepat waktu.", possibleImpact: "Selamat.", saferAction: "Lapor otoritas.", lesson: "Tidak ada kata terlambat untuk berhenti." },
        "c2b-2": { why: "Tekanan psikologis.", possibleImpact: "Rugi finansial.", saferAction: "Minta bantuan guru/ortu.", lesson: "Jangan ragu bertanya." },
      },
      endingAnalyses: {
        "end-safe": "Jalur keputusan terbaik.",
        "end-mixed": "Jalur reflektif yang baik untuk belajar.",
        "end-risky": "Jalur peringatan risiko.",
      },
      references: [
        { title: "OJK — Waspada Penipuan", url: "https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Booklet-Waspada-Penipuan-Scam-OJK.aspx", scope: "Panduan resmi pencegahan scam." },
      ],
    },
  };
}

export function ScenarioEditor({ initialScenario, isNew = false }: { initialScenario?: Scenario; isNew?: boolean }) {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario>(() => initialScenario || createBlankScenario());
  const [activeTab, setActiveTab] = useState<"meta" | "nodes" | "debriefing" | "validate">("meta");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  const validation = useMemo(() => {
    return validateScenarioGraph(scenario);
  }, [scenario]);

  const allNodeIds = useMemo(() => scenario.nodes.map(n => n.id), [scenario.nodes]);

  // Tab 1: Meta updaters
  const updateMeta = (field: keyof Scenario, value: unknown) => {
    setScenario(prev => ({ ...prev, [field]: value }));
  };

  // Tab 2: Node operations
  const updateNode = (id: string, updated: ScenarioNode) => {
    setScenario(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => (n.id === id ? updated : n)),
    }));
  };

  const addMessageNode = () => {
    const newId = `msg-${Date.now().toString().slice(-4)}`;
    const newNode: MessageNode = {
      id: newId,
      type: "message",
      speaker: "Pelaku",
      content: "Pesan baru…",
      nextNodeId: allNodeIds[0] || "",
    };
    setScenario(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
  };

  const addDecisionNode = () => {
    const newId = `dec-${Date.now().toString().slice(-4)}`;
    const c1Id = `c-${Date.now().toString().slice(-3)}a`;
    const c2Id = `c-${Date.now().toString().slice(-3)}b`;
    const newNode: DecisionNode = {
      id: newId,
      type: "decision",
      prompt: "Pertanyaan keputusan baru?",
      choices: [
        {
          id: c1Id,
          label: "Pilihan 1",
          response: "Tanggapan pilihan 1",
          consequence: { title: "Konsekuensi 1", description: "Dampak pilihan 1", riskLevel: "low" },
          nextNodeId: allNodeIds[0] || "",
        },
        {
          id: c2Id,
          label: "Pilihan 2",
          response: "Tanggapan pilihan 2",
          consequence: { title: "Konsekuensi 2", description: "Dampak pilihan 2", riskLevel: "high" },
          nextNodeId: allNodeIds[0] || "",
        },
      ],
    };
    setScenario(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
  };

  const addEndingNode = () => {
    const newId = `end-${Date.now().toString().slice(-4)}`;
    const newNode: EndingNode = {
      id: newId,
      type: "ending",
      title: "Judul Ending Baru",
      content: "Penjelasan akhir simulasi.",
    };
    setScenario(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
  };

  const deleteNode = (id: string) => {
    if (scenario.nodes.length <= 1) {
      alert("Skenario harus memiliki minimal satu node.");
      return;
    }
    if (scenario.startNodeId === id) {
      alert("Tidak dapat menghapus startNodeId. Ubah startNodeId terlebih dahulu.");
      return;
    }
    if (confirm(`Hapus node "${id}"? Pastikan tidak ada pilihan atau pesan lain yang menunjuk ke node ini.`)) {
      setScenario(prev => ({ ...prev, nodes: prev.nodes.filter(n => n.id !== id) }));
    }
  };

  // Save handler
  const handleSave = async (status: ScenarioStatus) => {
    setNotice("");
    setErrorNotice("");

    if (!scenario.title.trim()) {
      setErrorNotice("Judul skenario wajib diisi.");
      setActiveTab("meta");
      return;
    }

    if (status === "published") {
      const res = validateScenarioGraph(scenario);
      if (!res.valid) {
        setErrorNotice(`Skenario belum dapat diterbitkan karena belum lolos validasi graph: ${res.errors.join("; ")}`);
        setActiveTab("validate");
        return;
      }
    }

    try {
      const toSave = { ...scenario, status };
      await localScenarioRepository.saveScenario(toSave);
      setNotice(status === "published" ? "Skenario berhasil divalidasi dan diterbitkan!" : "Skenario berhasil disimpan sebagai Draft.");
      setTimeout(() => {
        router.push("/admin/skenario");
      }, 900);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Gagal menyimpan skenario.");
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard Admin", href: "/admin" },
          { label: "Manajemen Skenario", href: "/admin/skenario" },
          { label: isNew ? "Tambah Skenario" : `Edit: ${scenario.title || "Skenario"}` },
        ]}
      />

      <PageHeader
        eyebrow="RUANG ADMIN · EDITOR SKENARIO"
        title={isNew ? "Tambah Skenario Baru" : `Edit Skenario: ${scenario.title}`}
        description="Kelola metadata skenario, struktur percakapan, titik keputusan, konsekuensi, dan materi debriefing edukatif."
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye size={16} /> Preview Simulasi
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => handleSave("draft")}
          >
            <Save size={16} /> Simpan Draft
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={() => handleSave("published")}
          >
            <CheckCircle2 size={16} /> Validasi & Terbitkan
          </button>
        </div>
      </PageHeader>

      {notice && (
        <div className="admin-alert-banner success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>×</button>
        </div>
      )}
      {errorNotice && (
        <div className="admin-alert-banner danger" role="alert">
          <span>{errorNotice}</span>
          <button type="button" onClick={() => setErrorNotice("")}>×</button>
        </div>
      )}

      {/* Tabs Bar */}
      <nav className="admin-tab-nav" aria-label="Tab Editor Skenario">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "meta" ? "active" : ""}`}
          onClick={() => setActiveTab("meta")}
        >
          1. Metadata & Konteks Cerita
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "nodes" ? "active" : ""}`}
          onClick={() => setActiveTab("nodes")}
        >
          2. Alur Pesan & Titik Keputusan ({scenario.nodes.length} Node)
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "debriefing" ? "active" : ""}`}
          onClick={() => setActiveTab("debriefing")}
        >
          3. Debriefing & Analisis Risiko
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "validate" ? "active" : ""}`}
          onClick={() => setActiveTab("validate")}
        >
          4. Validasi Graph & Visualisasi {validation.valid ? "✓" : "(!)"}
        </button>
      </nav>

      {/* TAB 1: METADATA */}
      {activeTab === "meta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="admin-card">
            <h2>Informasi Dasar Skenario</h2>
            <div className="node-editor-fields">
              <label>
                <span>Judul Skenario</span>
                <input
                  type="text"
                  className="input"
                  value={scenario.title}
                  onChange={e => updateMeta("title", e.target.value)}
                  placeholder="Contoh: Lowongan Kerja Paruh Waktu Palsu"
                />
              </label>

              <label>
                <span>Slug URL (identifier unik)</span>
                <input
                  type="text"
                  className="input"
                  value={scenario.slug}
                  onChange={e => updateMeta("slug", e.target.value)}
                />
              </label>

              <label>
                <span>Kategori Skenario</span>
                <select
                  className="admin-select"
                  value={scenario.category}
                  onChange={e => updateMeta("category", e.target.value as ScenarioCategory)}
                >
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Tingkat Kesulitan</span>
                <select
                  className="admin-select"
                  value={scenario.difficulty ?? "Dasar"}
                  onChange={e => updateMeta("difficulty", e.target.value)}
                >
                  <option value="Dasar">Dasar</option>
                  <option value="Menengah">Menengah</option>
                </select>
              </label>

              <label>
                <span>Estimasi Durasi (menit)</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="input"
                  value={scenario.estimatedDurationMinutes ?? 10}
                  onChange={e => updateMeta("estimatedDurationMinutes", Number(e.target.value))}
                />
              </label>

              <label>
                <span>Status Skenario</span>
                <select
                  className="admin-select"
                  value={scenario.status}
                  onChange={e => updateMeta("status", e.target.value as ScenarioStatus)}
                >
                  <option value="draft">Draft (Belum dapat diakses siswa)</option>
                  <option value="published">Published (Aktif untuk siswa)</option>
                  <option value="archived">Archived (Diarsipkan)</option>
                </select>
              </label>

              <label className="span-full">
                <span>Deskripsi Singkat Skenario</span>
                <textarea
                  rows={2}
                  className="input"
                  value={scenario.description}
                  onChange={e => updateMeta("description", e.target.value)}
                  placeholder="Deskripsi ikhtisar skenario untuk katalog siswa…"
                />
              </label>

              <label className="span-full">
                <span>Konteks Cerita / Situasi Awal Siswa</span>
                <textarea
                  rows={3}
                  className="input"
                  value={scenario.context}
                  onChange={e => updateMeta("context", e.target.value)}
                  placeholder="Ceritakan latar belakang situasi penipuan yang dialami siswa…"
                />
              </label>
            </div>
          </section>

          <section className="admin-card">
            <h2>Tujuan Pembelajaran Skenario</h2>
            <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: -8 }}>
              Tuliskan satu tujuan pembelajaran per baris.
            </p>
            <textarea
              rows={4}
              className="input"
              value={scenario.learningObjectives.join("\n")}
              onChange={e => updateMeta("learningObjectives", e.target.value.split("\n"))}
            />
          </section>

          <section className="admin-card">
            <h2>Kategori Materi Terkait</h2>
            <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: -8 }}>
              Pilih modul materi kurikulum yang berhubungan dengan skenario ini.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              {MATERIAL_CATEGORIES.map(cat => {
                const checked = scenario.relatedMaterials.includes(cat);
                return (
                  <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => {
                        const next = e.target.checked
                          ? [...scenario.relatedMaterials, cat]
                          : scenario.relatedMaterials.filter(c => c !== cat);
                        updateMeta("relatedMaterials", next);
                      }}
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: NODES & CONVERSATION */}
      {activeTab === "nodes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Node Awal (Start Node ID):</label>
              <select
                className="admin-select"
                value={scenario.startNodeId}
                onChange={e => updateMeta("startNodeId", e.target.value)}
              >
                {allNodeIds.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="button button-secondary" onClick={addMessageNode}>
                <Plus size={14} /> Pesan Baru
              </button>
              <button type="button" className="button button-secondary" onClick={addDecisionNode}>
                <Plus size={14} /> Titik Keputusan
              </button>
              <button type="button" className="button button-secondary" onClick={addEndingNode}>
                <Plus size={14} /> Ending Baru
              </button>
            </div>
          </div>

          <div className="node-editor-list">
            {scenario.nodes.map((node, index) => (
              <div key={node.id} className="node-editor-item">
                <div className="node-editor-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Badge tone={node.type === "decision" ? "teal" : node.type === "ending" ? "success" : "neutral"}>
                      {node.type.toUpperCase()}
                    </Badge>
                    <strong>Node #{index + 1}: <code>{node.id}</code></strong>
                    {scenario.startNodeId === node.id && (
                      <Badge tone="warning">Start Node</Badge>
                    )}
                  </div>

                  <button
                    type="button"
                    className="admin-btn-sm admin-btn-danger"
                    onClick={() => deleteNode(node.id)}
                    title="Hapus node"
                  >
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>

                {/* Message Node Editor */}
                {node.type === "message" && (
                  <div className="node-editor-fields">
                    <label>
                      <span>Speaker (Pengirim Pesan)</span>
                      <select
                        className="admin-select"
                        value={node.speaker}
                        onChange={e => updateNode(node.id, { ...node, speaker: e.target.value as ScenarioSpeaker })}
                      >
                        {SPEAKERS.map(spk => (
                          <option key={spk} value={spk}>{spk}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Lanjut ke Node (Next Node ID)</span>
                      <select
                        className="admin-select"
                        value={node.nextNodeId}
                        onChange={e => updateNode(node.id, { ...node, nextNodeId: e.target.value })}
                      >
                        <option value="">Pilih Node Tujuan…</option>
                        {allNodeIds.filter(id => id !== node.id).map(id => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </select>
                    </label>

                    <label className="span-full">
                      <span>Isi Pesan Percakapan</span>
                      <textarea
                        rows={3}
                        className="input"
                        value={node.content}
                        onChange={e => updateNode(node.id, { ...node, content: e.target.value })}
                      />
                    </label>
                  </div>
                )}

                {/* Decision Node Editor */}
                {node.type === "decision" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="node-editor-fields">
                      <label className="span-full">
                        <span>Pertanyaan Keputusan (Prompt)</span>
                        <input
                          type="text"
                          className="input"
                          value={node.prompt}
                          onChange={e => updateNode(node.id, { ...node, prompt: e.target.value })}
                        />
                      </label>
                      <label className="span-full">
                        <span>Konteks Tambahan (Opsional)</span>
                        <input
                          type="text"
                          className="input"
                          value={node.context ?? ""}
                          onChange={e => updateNode(node.id, { ...node, context: e.target.value })}
                        />
                      </label>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <strong style={{ fontSize: 13 }}>Pilihan Respons ({node.choices.length} Pilihan):</strong>
                        <button
                          type="button"
                          className="admin-btn-sm admin-btn-outline"
                          onClick={() => {
                            const newChoice: ScenarioChoice = {
                              id: `c-${Date.now().toString().slice(-4)}`,
                              label: "Pilihan baru",
                              response: "Tanggapan pilihan",
                              consequence: { title: "Dampak", description: "Deskripsi dampak", riskLevel: "medium" },
                              nextNodeId: allNodeIds[0] || "",
                            };
                            updateNode(node.id, { ...node, choices: [...node.choices, newChoice] });
                          }}
                        >
                          <Plus size={13} /> Tambah Pilihan
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {node.choices.map((choice, cIdx) => (
                          <div key={choice.id || cIdx} className="choice-editor-box">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <Badge tone="teal">Pilihan {cIdx + 1} (ID: {choice.id})</Badge>
                              {node.choices.length > 2 && (
                                <button
                                  type="button"
                                  className="admin-btn-sm admin-btn-danger"
                                  onClick={() => {
                                    updateNode(node.id, {
                                      ...node,
                                      choices: node.choices.filter((_, idx) => idx !== cIdx),
                                    });
                                  }}
                                >
                                  <Trash2 size={12} /> Hapus
                                </button>
                              )}
                            </div>

                            <div className="node-editor-fields">
                              <label>
                                <span>Teks Pilihan (Label Tombol Siswa)</span>
                                <input
                                  type="text"
                                  className="input"
                                  value={choice.label}
                                  onChange={e => {
                                    const nextChoices = [...node.choices];
                                    nextChoices[cIdx] = { ...choice, label: e.target.value };
                                    updateNode(node.id, { ...node, choices: nextChoices });
                                  }}
                                />
                              </label>

                              <label>
                                <span>Balasan Ucapan Karakter (Response)</span>
                                <input
                                  type="text"
                                  className="input"
                                  value={choice.response}
                                  onChange={e => {
                                    const nextChoices = [...node.choices];
                                    nextChoices[cIdx] = { ...choice, response: e.target.value };
                                    updateNode(node.id, { ...node, choices: nextChoices });
                                  }}
                                />
                              </label>

                              <label>
                                <span>Judul Konsekuensi</span>
                                <input
                                  type="text"
                                  className="input"
                                  value={choice.consequence.title}
                                  onChange={e => {
                                    const nextChoices = [...node.choices];
                                    nextChoices[cIdx] = {
                                      ...choice,
                                      consequence: { ...choice.consequence, title: e.target.value },
                                    };
                                    updateNode(node.id, { ...node, choices: nextChoices });
                                  }}
                                />
                              </label>

                              <label>
                                <span>Tingkat Risiko Konsekuensi</span>
                                <select
                                  className="admin-select"
                                  value={choice.consequence.riskLevel}
                                  onChange={e => {
                                    const nextChoices = [...node.choices];
                                    nextChoices[cIdx] = {
                                      ...choice,
                                      consequence: { ...choice.consequence, riskLevel: e.target.value as RiskLevel },
                                    };
                                    updateNode(node.id, { ...node, choices: nextChoices });
                                  }}
                                >
                                  {RISK_LEVELS.map(lvl => (
                                    <option key={lvl} value={lvl}>{lvl.toUpperCase()}</option>
                                  ))}
                                </select>
                              </label>

                              <label className="span-full">
                                <span>Uraian Dampak Konsekuensi</span>
                                <textarea
                                  rows={2}
                                  className="input"
                                  value={choice.consequence.description}
                                  onChange={e => {
                                    const nextChoices = [...node.choices];
                                    nextChoices[cIdx] = {
                                      ...choice,
                                      consequence: { ...choice.consequence, description: e.target.value },
                                    };
                                    updateNode(node.id, { ...node, choices: nextChoices });
                                  }}
                                />
                              </label>

                              <label className="span-full">
                                <span>Tujuan Cabang Berikutnya (Next Node ID)</span>
                                <select
                                  className="admin-select"
                                  value={choice.nextNodeId}
                                  onChange={e => {
                                    const nextChoices = [...node.choices];
                                    nextChoices[cIdx] = { ...choice, nextNodeId: e.target.value };
                                    updateNode(node.id, { ...node, choices: nextChoices });
                                  }}
                                >
                                  <option value="">Pilih Node Tujuan Cabang…</option>
                                  {allNodeIds.filter(id => id !== node.id).map(id => (
                                    <option key={id} value={id}>{id}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ending Node Editor */}
                {node.type === "ending" && (
                  <div className="node-editor-fields">
                    <label className="span-full">
                      <span>Judul Ending</span>
                      <input
                        type="text"
                        className="input"
                        value={node.title}
                        onChange={e => updateNode(node.id, { ...node, title: e.target.value })}
                      />
                    </label>
                    <label className="span-full">
                      <span>Uraian Hasil Akhir (Content)</span>
                      <textarea
                        rows={3}
                        className="input"
                        value={node.content}
                        onChange={e => updateNode(node.id, { ...node, content: e.target.value })}
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEBRIEFING */}
      {activeTab === "debriefing" && scenario.learning && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="admin-card">
            <h2>Ringkasan & Kesimpulan Debriefing</h2>
            <div className="node-editor-fields">
              <label className="span-full">
                <span>Ringkasan Debriefing</span>
                <textarea
                  rows={3}
                  className="input"
                  value={scenario.learning.summary}
                  onChange={e => {
                    const l = scenario.learning!;
                    setScenario(prev => ({ ...prev, learning: { ...l, summary: e.target.value } }));
                  }}
                />
              </label>

              <label className="span-full">
                <span>Kesimpulan Edukatif Pembelajaran</span>
                <textarea
                  rows={3}
                  className="input"
                  value={scenario.learning.conclusion}
                  onChange={e => {
                    const l = scenario.learning!;
                    setScenario(prev => ({ ...prev, learning: { ...l, conclusion: e.target.value } }));
                  }}
                />
              </label>
            </div>
          </section>

          {/* Red Flags Manager */}
          <section className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2>Tanda Bahaya (Red Flags) — Minimal 4</h2>
              <button
                type="button"
                className="admin-btn-sm admin-btn-outline"
                onClick={() => {
                  const l = scenario.learning!;
                  const newRf = {
                    id: `rf-${Date.now().toString().slice(-4)}`,
                    title: "Tanda bahaya baru",
                    description: "Penjelasan tanda bahaya",
                    nodeId: allNodeIds[0] || "",
                  };
                  setScenario(prev => ({ ...prev, learning: { ...l, redFlags: [...l.redFlags, newRf] } }));
                }}
              >
                <Plus size={13} /> Tambah Red Flag
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scenario.learning.redFlags.map((rf, idx) => (
                <div key={rf.id || idx} style={{ padding: 12, background: "#fdf8f8", border: "1px solid #f9d8d8", borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Badge tone="danger">Red Flag #{idx + 1}</Badge>
                    <button
                      type="button"
                      className="admin-btn-sm admin-btn-danger"
                      onClick={() => {
                        const l = scenario.learning!;
                        setScenario(prev => ({
                          ...prev,
                          learning: { ...l, redFlags: l.redFlags.filter((_, i) => i !== idx) },
                        }));
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="node-editor-fields">
                    <label>
                      <span>Judul Tanda Bahaya</span>
                      <input
                        type="text"
                        className="input"
                        value={rf.title}
                        onChange={e => {
                          const l = scenario.learning!;
                          const nextRfs = [...l.redFlags];
                          nextRfs[idx] = { ...rf, title: e.target.value };
                          setScenario(prev => ({ ...prev, learning: { ...l, redFlags: nextRfs } }));
                        }}
                      />
                    </label>
                    <label>
                      <span>Node Kemunculan (Node ID)</span>
                      <select
                        className="admin-select"
                        value={rf.nodeId}
                        onChange={e => {
                          const l = scenario.learning!;
                          const nextRfs = [...l.redFlags];
                          nextRfs[idx] = { ...rf, nodeId: e.target.value };
                          setScenario(prev => ({ ...prev, learning: { ...l, redFlags: nextRfs } }));
                        }}
                      >
                        {allNodeIds.map(id => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </select>
                    </label>
                    <label className="span-full">
                      <span>Uraian Mengapa Perlu Diwaspadai</span>
                      <textarea
                        rows={2}
                        className="input"
                        value={rf.description}
                        onChange={e => {
                          const l = scenario.learning!;
                          const nextRfs = [...l.redFlags];
                          nextRfs[idx] = { ...rf, description: e.target.value };
                          setScenario(prev => ({ ...prev, learning: { ...l, redFlags: nextRfs } }));
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Safe Actions */}
          <section className="admin-card">
            <h2>Langkah Pengamanan (Safe Actions) — Minimal 3</h2>
            <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: -8 }}>
              Tuliskan satu langkah pengamanan per baris.
            </p>
            <textarea
              rows={4}
              className="input"
              value={scenario.learning.safeActions.join("\n")}
              onChange={e => {
                const l = scenario.learning!;
                setScenario(prev => ({
                  ...prev,
                  learning: { ...l, safeActions: e.target.value.split("\n").filter(Boolean) },
                }));
              }}
            />
          </section>
        </div>
      )}

      {/* TAB 4: GRAPH VALIDATION & VISUALIZER */}
      {activeTab === "validate" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2>Status Uji Validasi Graph Skenario</h2>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setNotice(validation.valid ? "Graph valid: Seluruh simpul dan percabangan terhubung sempurna." : "Ditemukan masalah pada graph skenario. Periksa rincian di bawah.");
                }}
              >
                <CheckCircle2 size={16} /> Periksa Validasi Ulang
              </button>
            </div>

            <div className={`validation-result-panel ${validation.valid ? "valid" : "invalid"}`}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {validation.valid ? (
                  <CheckCircle2 size={20} style={{ color: "#21865b" }} />
                ) : (
                  <AlertTriangle size={20} style={{ color: "#a83c3c" }} />
                )}
                <strong style={{ fontSize: 14 }}>
                  {validation.valid
                    ? "✓ Skenario Lolos Validasi Graph! Siap diterbitkan untuk siswa."
                    : `Ditemukan ${validation.errors.length} masalah validasi graph:`}
                </strong>
              </div>
              {!validation.valid && (
                <ul className="validation-errors-list">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <ScenarioGraphVisualizer scenario={scenario} />
        </div>
      )}

      {/* Preview Modal Overlay */}
      {previewOpen && (
        <div
          className="material-confirm-backdrop"
          role="presentation"
          onKeyDown={e => { if (e.key === "Escape") setPreviewOpen(false); }}
        >
          <div style={{ width: "min(100%, 940px)", maxHeight: "90vh", overflowY: "auto", background: "white", padding: 24, borderRadius: 14 }}>
            <ScenarioPreviewModal scenario={scenario} onClose={() => setPreviewOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
