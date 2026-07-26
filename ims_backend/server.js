import "./src/config/env.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is Listening on ${PORT}`);
})
