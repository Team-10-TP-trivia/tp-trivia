import PrivateRooms from "./PrivateRoom/PrivateRooms";
import PublicRooms from "./PublicRoom/PublicRooms";

export default function JoinRoom() {
    return (
        <div>
            <PublicRooms />
            <PrivateRooms />
        </div>
    )
}