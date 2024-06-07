import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        height: "fit-content",
        flexDirection: "row",
        padding: "10px",
        gap: "10px",
        justifyContent: "center",
      }}
      display={"flex"}
    >
      <p>© 2021 TP-Trivia</p>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
      }}>
        <p>Created by:</p>
        <Box>
          <p>Tihomir Petrov</p>
          <p>Petar Tzanov</p>
        </Box>
      </Box>
    </Box>
  );
}
