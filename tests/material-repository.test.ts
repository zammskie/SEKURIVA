import test from "node:test";
import assert from "node:assert/strict";
import { seedMaterials } from "../src/data/materials/seed";
import { MATERIAL_STORAGE_KEY, localMaterialRepository } from "../src/lib/materials/local-material-repository";
import { validateMaterial } from "../src/lib/materials/validation";

function browserStorage() {
  const values = new Map<string, string>();
  const localStorage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage, dispatchEvent: () => true } });
  return values;
}

test("five initial materials are Draft, survive reads, and remain hidden from students", async () => {
  const values = browserStorage();
  const all = await localMaterialRepository.getAllMaterials();
  assert.equal(all.length, 5);
  assert.ok(all.every(item => item.status === "Draft"));
  assert.equal(all.reduce((count, item) => count + (item.learningChecks?.length ?? 0), 0), 4);
  assert.equal((await localMaterialRepository.getPublishedMaterials()).length, 0);
  assert.ok(values.has(MATERIAL_STORAGE_KEY));
  assert.deepEqual(await localMaterialRepository.getAllMaterials(), all);
});

test("create, edit, publish, unpublish and delete use the same persisted collection", async () => {
  browserStorage();
  const original = seedMaterials[0];
  const input = { ...original, title: "Materi Uji Keamanan", status: "Draft" as const };
  const created = await localMaterialRepository.createMaterial(input);
  assert.equal(created.slug, "materi-uji-keamanan");
  assert.equal((await localMaterialRepository.getPublishedMaterials()).length, 0);
  const published = await localMaterialRepository.updateMaterial(created.id, { ...created, title: "Materi Uji Diperbarui", status: "Published" });
  assert.equal(published.slug, "materi-uji-diperbarui");
  assert.equal((await localMaterialRepository.getMaterialBySlug(published.slug))?.id, created.id);
  assert.equal((await localMaterialRepository.getPublishedMaterials()).length, 1);
  assert.equal((await localMaterialRepository.searchMaterials("diperbarui")).length, 1);
  assert.equal((await localMaterialRepository.getMaterialsByCategory(original.category)).length, 2);
  await localMaterialRepository.updateMaterial(created.id, { ...published, status: "Draft" });
  assert.equal((await localMaterialRepository.getPublishedMaterials()).length, 0);
  assert.equal(await localMaterialRepository.deleteMaterial(created.id), true);
  assert.equal((await localMaterialRepository.getAllMaterials()).length, 5);
});

test("duplicate titles and incomplete sections are rejected; damaged JSON falls back to seeds", async () => {
  const values = browserStorage();
  const original = seedMaterials[0];
  const errors = validateMaterial({ ...original, title: seedMaterials[1].title, sections: [{ ...original.sections[0], paragraphs: [] }] }, seedMaterials);
  assert.ok(errors.title);
  assert.ok(errors["sections.0.paragraphs"]);
  values.set(MATERIAL_STORAGE_KEY, "{broken");
  assert.equal((await localMaterialRepository.getAllMaterials()).length, 5);
});
