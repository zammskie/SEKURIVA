"use client";
import { useState } from "react";
import type { LearningCheck as LearningCheckContent } from "@/lib/types/material";
import { Button } from "@/components/ui/button";

export function LearningCheck({ check }: { check: LearningCheckContent }) {
  const [selected, setSelected] = useState<string | null>(null);
  const option = check.options.find(item => item.id === selected);
  return <section className="learning-check" aria-labelledby="check-heading"><p className="eyebrow">CEK PEMAHAMAN · TANPA PENILAIAN TERSIMPAN</p><h2 id="check-heading">Coba terapkan pemahamanmu.</h2><fieldset className="simulation-choices" disabled={!!option}><legend>{check.question}</legend>{check.options.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}</fieldset>{option && <div className="learning-feedback" role="status"><h3>{selected === check.correctOptionId ? "Tepat. Ini alasannya." : "Mari periksa kembali."}</h3><p>{option.explanation}</p><Button variant="secondary" onClick={() => setSelected(null)}>Coba lagi</Button></div>}</section>;
}
