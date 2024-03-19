import PropTypes from "prop-types";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllGroups } from "../../../services/Groups/Groups-services";
import Box from "@mui/material/Box";

export default function SearchGroups({ setGroups }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    const unsubscribe = getAllGroups(setGroups, search);
    return () => unsubscribe();
  }, [setGroups, search]);

  return (
    <Box>
      <input
        style={{ width: "15vw", height: "20px", margin: "10px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Search group by title"
      />
    </Box>
  );
}

SearchGroups.propTypes = {
  setGroups: PropTypes.func.isRequired,
};
