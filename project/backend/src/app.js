const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const sequelize = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

// Use your routes
app.use("/api", apiRoutes);

// Sync the database models with the actual database
sequelize.sync().then(() => {
  console.log("Database synced");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
