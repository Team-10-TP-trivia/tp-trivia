import AdminQuizzes from "../AdminQuizzes/AdminQuizzes";
import AdminRequests from "../AdminRequests/AdminRequests";
import AdminUsers from "../AdminUsers/AdminUsers";
import './AdminPanel.css';

export default function AdminPanel() {
  return (
    <div id='admin-options-container'>
      <AdminUsers />
      <AdminRequests />
      <AdminQuizzes />
    </div>
  );
}