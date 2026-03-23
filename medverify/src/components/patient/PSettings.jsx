import SettingsPage from "../../pages/SettingsPage.jsx";

export default function PSettings({ user, onLogout }) {
  return <SettingsPage user={user} role="patient" onLogout={onLogout} />;
}
