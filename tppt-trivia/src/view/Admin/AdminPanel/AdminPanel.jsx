import AdminRequests from "../AdminRequests/AdminRequests";
import AdminUsers from "../AdminUsers/AdminUsers";

export default function AdminPanel() {
  return (
    <div>
      <AdminUsers />
      <AdminRequests />
    </div>
  );
}