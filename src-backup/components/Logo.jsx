const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';

const LOGO_URL = 'https://media.db.com/images/public/user_6ac0cb096d759e95165bdee0/40c330f11_image.png';

export default function Logo({ className = '', showText = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative h-9 w-auto rounded-lg overflow-hidden ring-1 ring-border/60 shadow-sm shrink-0">
        <img
          src={LOGO_URL}
          alt="CodeRant logo"
          className="h-full w-auto object-contain"
        />
      </div>
      {showText && (
        <span className="font-heading font-extrabold text-lg tracking-tight text-foreground hidden sm:inline">
          Code<span className="text-gradient-brand">Rant</span>
        </span>
      )}
    </div>
  );
}