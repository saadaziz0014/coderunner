const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();

app.use(express.json());

app.post("/execute", (req, res) => {
  const { code } = req.body;

  // Write the code to a C++ file
  const fileName = "code.cpp";
  require("fs").writeFileSync(fileName, code);

  // Execute the C++ code
  const filePath = path.join(__dirname, fileName);
  exec(`g++ ${filePath} -o code && code.exe`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send("Internal Server Error");
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(400).send("Bad Request");
    }

    // Send the output of the executed code
    console.log(stdout);
    res.send("Executed");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
