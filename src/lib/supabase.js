import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid (non-empty, not placeholders, and starts with eyJ as all Supabase JWT keys do)
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  supabaseAnonKey.startsWith('eyJ');

let supabaseClient = null;

if (hasValidCredentials) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// --- High Fidelity Mock Implementation ---
class MockSupabaseClient {
  constructor() {
    this.isMock = true;
    console.warn("⚠️ Zero-Trust Agent: Using client-side local database simulation (localStorage). Configure .env variables for real Supabase connectivity.");
    this.initMockDB();
  }

  initMockDB() {
    const defaultSessions = [
      { id: 'session-1', exam_code: 'JEE-MAIN-2026', board: 'NTA', subject: 'Physics Variant A/B/C', status: 'Pending Compilation', committee1_approved: false, committee2_approved: false, created_at: new Date().toISOString() },
      { id: 'session-2', exam_code: 'NEET-UG-2026', board: 'NTA', subject: 'Biology Variant A/B/C', status: 'Pending Compilation', committee1_approved: false, committee2_approved: false, created_at: new Date().toISOString() },
      { id: 'session-3', exam_code: 'CBSE-XII-MATH', board: 'CBSE', subject: 'Mathematics Variant A/B/C', status: 'Pending Compilation', committee1_approved: false, committee2_approved: false, created_at: new Date().toISOString() },
      { id: 'session-4', exam_code: 'RBI-GRADE-B', board: 'RBI', subject: 'Economic & Social Issues', status: 'Pending Compilation', committee1_approved: false, committee2_approved: false, created_at: new Date().toISOString() }
    ];

    const defaultCommittees = [
      { id: 'c-1', name: 'Dr. Alex Morgan', role: 'Chief Security Reviewer (Committee 2)', email: 'alex.morgan@nta.gov.in', created_at: new Date().toISOString() },
      { id: 'c-2', name: 'Prof. Sarah Jenkins', role: 'Subject Expert Compiler (Committee 1)', email: 's.jenkins@nta.gov.in', created_at: new Date().toISOString() }
    ];

    if (!localStorage.getItem('zt_exam_sessions')) {
      localStorage.setItem('zt_exam_sessions', JSON.stringify(defaultSessions));
    }
    if (!localStorage.getItem('zt_committees')) {
      localStorage.setItem('zt_committees', JSON.stringify(defaultCommittees));
    }
    if (!localStorage.getItem('zt_exam_vault')) {
      localStorage.setItem('zt_exam_vault', JSON.stringify([]));
    }
    if (!localStorage.getItem('zt_audit_log')) {
      localStorage.setItem('zt_audit_log', JSON.stringify([]));
    }
    if (!localStorage.getItem('zt_score_ledger')) {
      localStorage.setItem('zt_score_ledger', JSON.stringify([]));
    }
  }

  from(tableName) {
    const storageKey = `zt_${tableName}`;
    
    return {
      select: () => {
        return {
          eq: (field, value) => {
            const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const filtered = data.filter(row => row[field] === value);
            return Promise.resolve({ data: filtered, error: null });
          },
          order: (field, { ascending = true } = {}) => {
            const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const sorted = [...data].sort((a, b) => {
              if (a[field] < b[field]) return ascending ? -1 : 1;
              if (a[field] > b[field]) return ascending ? 1 : -1;
              return 0;
            });
            return Promise.resolve({ data: sorted, error: null });
          },
          then: (onfulfilled) => {
            const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
            return Promise.resolve({ data, error: null }).then(onfulfilled);
          }
        };
      },
      
      insert: (payload) => {
        // Enforce RLS Simulation: RLS table INSERT only
        // Append payload to mock DB
        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const rowsToInsert = Array.isArray(payload) ? payload : [payload];
        
        const newRows = rowsToInsert.map(row => ({
          id: row.id || `mock-${tableName}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
          ...row
        }));
        
        localStorage.setItem(storageKey, JSON.stringify([...data, ...newRows]));
        return Promise.resolve({ data: newRows, error: null });
      },

      update: (payload) => {
        // Some tables are INSERT only. Warn/prevent if it's vault, audit, or score ledger
        if (['exam_vault', 'audit_log', 'score_ledger'].includes(tableName)) {
          return Promise.resolve({ 
            data: null, 
            error: new Error(`RLS Violation: UPDATE on table '${tableName}' is strictly forbidden by Policy.`) 
          });
        }

        return {
          eq: (field, value) => {
            const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const updatedData = data.map(row => {
              if (row[field] === value) {
                return { ...row, ...payload };
              }
              return row;
            });
            localStorage.setItem(storageKey, JSON.stringify(updatedData));
            return Promise.resolve({ data: updatedData.filter(row => row[field] === value), error: null });
          }
        };
      },

      delete: () => {
        // Enforce RLS Simulation: DELETE is strictly forbidden on vault, logs, score ledger
        if (['exam_vault', 'audit_log', 'score_ledger'].includes(tableName)) {
          return {
            eq: () => Promise.resolve({ 
              data: null, 
              error: new Error(`RLS Violation: DELETE on table '${tableName}' is strictly forbidden by Policy.`) 
            })
          };
        }

        return {
          eq: (field, value) => {
            const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const remaining = data.filter(row => row[field] !== value);
            localStorage.setItem(storageKey, JSON.stringify(remaining));
            return Promise.resolve({ data: { message: "Deleted successfully" }, error: null });
          }
        };
      }
    };
  }
}

export const supabase = supabaseClient || new MockSupabaseClient();
export const isMockDB = !supabaseClient;
