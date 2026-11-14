export interface AdminActivity {
  readonly id: string;
  readonly type: "material" | "scenario" | "simulation";
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly actorName: string;
  readonly badgeTone?: "neutral" | "teal" | "success" | "warning" | "danger";
}

export const ACTIVITY_STORAGE_KEY = "sekuriva.activities.v1";
export const ACTIVITY_CHANGE_EVENT = "sekuriva:activities-changed";

function readActivities(): AdminActivity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeActivities(activities: AdminActivity[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities.slice(0, 50)));
  } catch {
    // fallback
  }
  window.dispatchEvent(new Event(ACTIVITY_CHANGE_EVENT));
}

export function logActivity(activity: Omit<AdminActivity, "id" | "timestamp">): AdminActivity {
  const item: AdminActivity = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...activity,
  };
  const all = readActivities();
  writeActivities([item, ...all]);
  return item;
}

export function getRecentActivities(limit = 10): AdminActivity[] {
  return readActivities().slice(0, limit);
}
