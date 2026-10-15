import React from 'react';
export default function FeaturePlaceholder({ owner, title, tasks }) {
 return <section className="panel placeholder"><span className="eyebrow">AREA KERJA · ANGGOTA {owner}</span><h2>{title}</h2><p>Fitur ini belum diimplementasikan. Kerjakan bagian berikut di folder milikmu.</p><ul>{tasks.map(task => <li key={task}>{task}</li>)}</ul></section>;
}
