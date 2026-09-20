//Install express server
const express = require("express");
const path = require("path");

const app = express();

const buildPath = path.join(__dirname, "dist", "my-fitnes-planner-app", "browser");

// Serve only the static files from the Angular browser build.
app.use(express.static(buildPath));

app.get("/*", (req, res) =>
  res.sendFile("index.html", { root: buildPath })
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
