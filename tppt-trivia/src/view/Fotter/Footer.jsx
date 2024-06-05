import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{backgroundColor: "#91fd5e",
    height: "fit-content",
    flexDirection: "column",
    padding: "10px",
    }}
    display={"flex"}>
      <p>© 2021 TP-Trivia</p>
      <div>Created by:
        <p>Tihomir Petrov</p>
        <p>Petar Tzanov</p></div>
    </Box>
  );
}