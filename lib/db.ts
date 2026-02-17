const { PGlite } = require('@electric-sql/pglite');
import { MIGRATIONS } from './schema';
import { SEED_DATA } from './seed';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const isPreview = typeof window !== 'undefined' && (window.parent !== window || window.location.hostname.includes('webcontainer') || window.location.hostname.includes('localhost'));
const isProd = !isPreview && !!(SUPABASE_URL && SUPABASE_KEY);

let sb: any = null;
let pg: any = null;
let isInit = false;

async function getDb() {
  if (pg) return pg;
  for (let i = 0; i < 3; i++) {
    try {
      pg = new PGlite('idb://noon-db');
      await pg.waitReady;
      return pg;
    } catch (e: any) {
      pg = null;
      if (String(e?.message).includes('Invalid FS bundle size')) {
        try {
          const r = indexedDB.deleteDatabase('/pglite/noon-db');
          await new Promise((ok, fail) => { r.onsuccess = ok; r.onerror = fail; r.onblocked = ok; });
        } catch {}
      }
      if (i < 2) {
        console.warn(`PGlite init attempt ${i + 1} failed, retrying...`);
        await new Promise(r => setTimeout(r, 1500 * (i + 1)));
      } else throw e;
    }
  }
  throw new Error('Failed to initialize PGlite after retries');
}

type R = { data: any; error: any };
class QB {
  _t: string; _op = 'select'; _sel = '*'; _w: string[] = []; _p: any[] = []; _ord = ''; _lim = ''; _d: any; _single = false;
  constructor(t: string) { this._t = t; }
  select(c = '*') { this._sel = c; return this; }
  insert(d: any) { this._op = 'insert'; this._d = Array.isArray(d) ? d : [d]; return this; }
  update(d: any) { this._op = 'update'; this._d = d; return this; }
  delete() { this._op = 'delete'; return this; }
  eq(c: string, v: any) { this._w.push(`"${c}"=$${this._p.length + 1}`); this._p.push(v); return this; }
  order(c: string, o?: { ascending?: boolean }) { this._ord = ` ORDER BY "${c}" ${o?.ascending === false ? 'DESC' : 'ASC'}`; return this; }
  limit(n: number) { this._lim = ` LIMIT ${n}`; return this; }
  single() { this._single = true; this._lim = ' LIMIT 1'; return this; }
  _wh() { return this._w.length ? ' WHERE ' + this._w.join(' AND ') : ''; }
  async _run(): Promise<R> {
    try {
      const d = await getDb(); let sql: string, p: any[] = [];
      switch (this._op) {
        case 'select': sql = `SELECT ${this._sel} FROM "${this._t}"${this._wh()}${this._ord}${this._lim}`; p = this._p; break;
        case 'insert': {
          const k = Object.keys(this._d[0]);
          const v = this._d.map((r: any, ri: number) => `(${k.map((_: any, ci: number) => `$${ri * k.length + ci + 1}`).join(',')})`).join(',');
          sql = `INSERT INTO "${this._t}" (${k.map((c: string) => `"${c}"`).join(',')}) VALUES ${v} RETURNING *`;
          p = this._d.flatMap((r: any) => k.map((c: string) => r[c]));
          break;
        }
        case 'update': {
          const k = Object.keys(this._d);
          const s = k.map((c: string, i: number) => `"${c}"=$${i + 1}`).join(',');
          p = k.map((c: string) => this._d[c]);
          const w = this._w.map((cl: string, i: number) => cl.replace(/\$\d+/, `$${k.length + i + 1}`)).join(' AND ');
          sql = `UPDATE "${this._t}" SET ${s}${w ? ' WHERE ' + w : ''} RETURNING *`;
          p.push(...this._p);
          break;
        }
        case 'delete': sql = `DELETE FROM "${this._t}"${this._wh()} RETURNING *`; p = this._p; break;
        default: return { data: null, error: 'Unknown op' };
      }
      const res = await d.query(sql, p);
      return { data: this._single ? (res.rows[0] ?? null) : res.rows, error: null };
    } catch (e) { return { data: null, error: e }; }
  }
  then(ok?: any, fail?: any) { return this._run().then(ok, fail); }
}

export const db = {
  from(table: string) {
    if (isProd) return sb.from(table);
    return new QB(table);
  }
};

export async function initializeDatabase() {
  if (isProd) {
    const { createClient } = await import('@supabase/supabase-js');
    sb = createClient(SUPABASE_URL!, SUPABASE_KEY!);
    return;
  }
  if (isInit) return;
  const d = await getDb();
  setupBridge();
  try {
    for (const m of MIGRATIONS) await d.exec(m);
    for (const s of SEED_DATA) await d.exec(s);
  } catch (e) { console.error('Migration/seed error:', e); }
  isInit = true;
}

function setupBridge() {
  (window as any).__APP_BRIDGE_READY__ = true;
  window.addEventListener('message', async (e) => {
    const { type, id, payload } = e.data || {};
    if (!type?.startsWith('DB_') || type === 'DB_RESPONSE' || type === 'DB_BRIDGE_READY') return;
    let res: any = { type: 'DB_RESPONSE', id, success: false, error: null };
    try {
      const d = await getDb();
      if (!d) throw new Error('Database not initialized');
      switch (type) {
        case 'DB_GET_TABLES': res.data = (await d.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).rows.map((r: any) => r.table_name); res.success = true; break;
        case 'DB_QUERY': if (!payload?.sql) throw new Error('Missing SQL'); const r = await d.query(payload.sql, payload.params); res.data = { rows: r.rows, affectedRows: r.affectedRows }; res.success = true; break;
        case 'DB_EXECUTE': if (!payload?.sql) throw new Error('Missing SQL'); if (payload.params?.length) await d.query(payload.sql, payload.params); else await d.exec(payload.sql); res.data = { success: true, affectedRows: 1 }; res.success = true; break;
        default: res.error = 'Unknown message type: ' + type;
      }
    } catch (err: any) { res.error = err?.message || String(err) || 'Unknown error'; }
    window.parent.postMessage(res, '*');
  });
  window.parent.postMessage({ type: 'DB_BRIDGE_READY' }, '*');
}
