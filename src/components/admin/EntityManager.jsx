const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Star, Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Reusable entity CRUD manager for admin.
 * fields: [{ name, label, type: 'text'|'textarea'|'select'|'number'|'boolean'|'date'|'array', options? }]
 */
export default function EntityManager({ entityName, fields, label, titleField = 'name' }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // record or {} for new or null
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await db.entities[entityName].list({ sort: '-created_date', limit: 100 });
      setRecords(res.items || []);
    } catch {
      setRecords([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [entityName]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { ...editing };
      const id = data.id;
      delete data.id;
      delete data.created_date;
      delete data.updated_date;
      delete data.created_by_id;

      if (id) {
        await db.entities[entityName].update(id, data);
      } else {
        await db.entities[entityName].create(data);
      }
      setEditing(null);
      await load();
    } catch (e) {
      alert('Error saving: ' + (e.message || 'Unknown error'));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await db.entities[entityName].delete(id);
      await load();
    } catch (e) {
      alert('Error deleting: ' + (e.message || 'Unknown error'));
    }
  };

  const updateField = (name, value) => {
    setEditing({ ...editing, [name]: value });
  };

  if (loading) {
    return <div className="h-64 rounded-2xl border border-border bg-card animate-pulse" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">{records.length} {label}</p>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      <div className="space-y-2">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No {label.toLowerCase()} yet. Click "Add New" to create one.
          </div>
        ) : (
          records.map((rec) => (
            <div key={rec.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {rec[titleField] || rec.title || rec.name || 'Untitled'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fields.filter(f => f.meta).map(f => `${f.label}: ${rec[f.name] || '—'}`).join(' · ')}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {fields.some(f => f.name === 'published' || f.name === 'status') && (
                  <span className={cn(
                    'mr-2 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    rec.published === false || rec.status === 'archived' || rec.status === 'expired' || rec.status === 'draft' || rec.review_status === 'pending'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-accent/10 text-accent'
                  )}>
                    {rec.status || (rec.published === false ? 'Unpublished' : 'Published')}
                  </span>
                )}
                <button
                  onClick={() => setEditing(rec)}
                  className="h-8 w-8 grid place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rec.id)}
                  className="h-8 w-8 grid place-items-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-card pb-3 border-b border-border">
              <h3 className="font-heading text-lg font-bold text-foreground">
                {editing.id ? 'Edit' : 'New'} {label.replace(/s$/, '')}
              </h3>
              <button onClick={() => setEditing(null)} className="h-8 w-8 grid place-items-center rounded-lg border border-border">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={editing[field.name]}
                  onChange={(v) => updateField(field.name, v)}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 sticky bottom-0 bg-card pt-4 border-t border-border">
              <button
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
        />
        <span className="text-sm font-medium text-foreground">{field.label}</span>
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="input-base">
          <option value="">—</option>
          {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
        <textarea rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} className="input-base resize-none" placeholder={field.placeholder || ''} />
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
        <input type="number" value={value ?? ''} onChange={(e) => onChange(Number(e.target.value))} className="input-base" />
      </div>
    );
  }

  if (field.type === 'date') {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
        <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} className="input-base" />
      </div>
    );
  }

  if (field.type === 'array') {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
        <input
          type="text"
          value={Array.isArray(value) ? value.join(', ') : (value || '')}
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          className="input-base"
          placeholder="Comma-separated values"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="input-base" placeholder={field.placeholder || ''} />
    </div>
  );
}