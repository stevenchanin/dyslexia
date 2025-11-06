// Dexie setup for offline persistence (example only)
import Dexie, { Table } from 'dexie';

export interface AttemptRow {
  id: string;
  sessionId: string;
  payload: unknown;
  createdAt: number;
  synced: boolean;
}

class AppDB extends Dexie {
  attempts!: Table<AttemptRow, string>;
  constructor() {
    super('appdb');
    this.version(1).stores({ attempts: 'id, sessionId, synced' });
  }
}

export const db = new AppDB();

export async function saveAttemptOffline(row: AttemptRow) {
  await db.attempts.put(row);
}

export async function flushAttemptsSync(submit: (row: AttemptRow) => Promise<void>) {
  const unsynced = await db.attempts.where({ synced: false }).toArray();
  for (const r of unsynced) {
    try {
      await submit(r);
      r.synced = true;
      await db.attempts.put(r);
    } catch {
      // retry later
    }
  }
}

