import React from 'react';
import i18n from "i18next";

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const CreatePlayer = React.lazy(() => import('./views/Player/CreatePlayer'));
const Wallet = React.lazy(() => import('./views/Wallet/Wallet'));
const Profile = React.lazy(() => import('./views/Profile/Profile'));

let current_lang = i18n.language

const routes = [
  { path: '/dashboard', name: current_lang === 'in' ? 'Dasbor' : 'Dashboard', component: Dashboard },
  { path: '/create-player', name: current_lang === 'in' ? 'Buat Player' : 'Create Player', component: CreatePlayer },
  { path: '/wallet', name: current_lang === 'in' ? 'Pemain Dompet' : 'Wallet Player', component: Wallet},
  { path: '/profile/:id', name: current_lang === 'in' ? 'Profil' : ' Profile ', component: Profile},
];

export default routes;
