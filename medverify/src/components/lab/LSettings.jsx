import SettingsPage from "../../pages/SettingsPage.jsx";

export default function LSettings({ user, onLogout }) {
  return <SettingsPage user={user} role="laboratory" onLogout={onLogout} />;
}
