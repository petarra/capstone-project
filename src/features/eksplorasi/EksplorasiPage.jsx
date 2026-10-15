import React from 'react';
import FeaturePlaceholder from '../../components/FeaturePlaceholder';
import QuestCard from '../../components/QuestCard';
import { useApp } from '../../context/AppContext';
// TODO Anggota 2: implementasikan fitur di folder ini.
export default function EksplorasiPage() { const { quests } = useApp(); return <><FeaturePlaceholder owner={2} title="Eksplorasi quest" tasks={["Pencarian berdasarkan judul dan filter kategori.", "Modal detail quest menggunakan props.", "Sediakan tempat tombol Ambil untuk integrasi anggota 4."]} /><div className="quest-grid">{quests.map(quest => <QuestCard key={quest.id} quest={quest} />)}</div></>; }
