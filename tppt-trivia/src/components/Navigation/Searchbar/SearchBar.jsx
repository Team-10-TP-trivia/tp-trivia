import { useEffect, useState, useRef } from "react";
import { getUsers } from "../../../services/UserServices/user-services";

const SearchBar = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    getUsers().then((users) => {
        if (!search) return;
        users = users.filter((user) => {
            return user.firstName.toLowerCase().includes(search.toLowerCase())
            || user.lastName.toLowerCase().includes(search.toLowerCase()) || user.username.toLowerCase().includes(search.toLowerCase())
            ;
        })
        setUsers(users);
    });
}, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowUsers(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search in the website..."
        value={search}
        onChange={handleSearchChange}
        ref={inputRef}
        onClick={() => setShowUsers(true)}
      />
      {showUsers && search && (
        <div
          style={{
            position: "absolute",
            boxShadow: "2px 2px 0px 0px rgba(0,0,0,0.15)",
            left: "0",
            width: "270px",
            zIndex: "1",
            backgroundColor: "white",
          }}
        >
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.uid}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                }}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="profile" />
                ) : null}
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>
            ))
          ) : (
            <div>
              <p>No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
