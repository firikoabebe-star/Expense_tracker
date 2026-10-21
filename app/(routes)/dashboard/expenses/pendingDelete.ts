"use client";

/**
 * How long the user has to press "Undo" before the delete is sent to the server.
 */
export const UNDO_WINDOW_MS = 5000;

type PendingDelete = {
  timer: ReturnType<typeof setTimeout> | null;
  cancelled: boolean;
};

type Listener = () => void;

/**
 * The registry deliberately lives outside of React: a pending delete has to
 * survive the component that started it being unmounted (for example the user
 * navigating away), so the delete is neither silently lost nor executed twice.
 */
const pendingDeletes = new Map<number, PendingDelete>();
const listeners = new Set<Listener>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

/** Ids of the expenses whose delete is currently pending. */
export function getPendingDeleteIds(): number[] {
  return Array.from(pendingDeletes.keys());
}

/**
 * Subscribes to pending delete changes. The listener is called immediately so
 * a freshly mounted table picks up deletes that were started elsewhere.
 */
export function subscribePendingDeletes(listener: Listener): () => void {
  listeners.add(listener);
  listener();
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Schedules a delete. The server call only runs once the undo window has
 * passed without an undo.
 */
export function scheduleExpenseDelete(
  expenseId: number,
  runDelete: () => void | Promise<void>
) {
  cancelExpenseDelete(expenseId);
  const entry: PendingDelete = { timer: null, cancelled: false };
  entry.timer = setTimeout(() => {
    entry.timer = null;
    if (entry.cancelled) {
      pendingDeletes.delete(expenseId);
      notify();
      return;
    }
    void Promise.resolve()
      .then(runDelete)
      .catch(() => undefined)
      .finally(() => {
        pendingDeletes.delete(expenseId);
        notify();
      });
  }, UNDO_WINDOW_MS);
  pendingDeletes.set(expenseId, entry);
  notify();
}

/** Cancels a scheduled delete (the "Undo" action). No-op when nothing is pending. */
export function cancelExpenseDelete(expenseId: number) {
  const entry = pendingDeletes.get(expenseId);
  if (!entry) return;
  entry.cancelled = true;
  if (entry.timer !== null) clearTimeout(entry.timer);
  pendingDeletes.delete(expenseId);
  notify();
}
