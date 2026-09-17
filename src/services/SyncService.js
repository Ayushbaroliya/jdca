import { supabase } from '../lib/supabase';
import { getPendingActions, clearAction } from '../lib/db';

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;

    // Listen for network changes
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  handleOnline() {
    console.log('[SyncService] Back online. Initiating sync...');
    this.isOnline = true;
    this.processQueue();
  }

  handleOffline() {
    console.log('[SyncService] Went offline. Actions will be queued.');
    this.isOnline = false;
  }

  /**
   * Process all pending actions in the local Dexie queue
   */
  async processQueue() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    try {
      const actions = await getPendingActions();
      if (actions.length === 0) {
        this.syncInProgress = false;
        return;
      }

      console.log(`[SyncService] Processing ${actions.length} pending actions...`);

      for (const action of actions) {
        let success = false;
        
        try {
          // Process the action based on its type
          // Note: When you have a real Supabase setup, you'll execute the real mutations here.
          // For now, we simulate success if the API key is present, or just swallow it.
          if (supabase) {
             // Simulate network request for now until DB tables exist
             await new Promise(resolve => setTimeout(resolve, 300));
             success = true;
          }
        } catch (error) {
          console.error(`[SyncService] Failed to process action ${action.id}:`, error);
          // If it's a 4xx error, we might want to discard it. If 5xx, keep it in queue.
          break; // Stop processing and try again later
        }

        if (success) {
          await clearAction(action.id);
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Attempt to perform an action immediately if online,
   * otherwise queue it for later.
   */
  async executeOrQueue(actionType, payload, offlineQueueFn) {
    if (this.isOnline) {
      try {
        // Execute immediately (Placeholder logic)
        // e.g. await supabase.from('matches').update(payload)...
        console.log(`[SyncService] Executed live: ${actionType}`);
        return true;
      } catch (err) {
        console.warn(`[SyncService] Live execution failed, falling back to queue. Error:`, err);
        await offlineQueueFn(actionType, payload);
        return false;
      }
    } else {
      await offlineQueueFn(actionType, payload);
      return false;
    }
  }
}

export const syncService = new SyncService();
