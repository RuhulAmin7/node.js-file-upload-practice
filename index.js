const fs = require("fs");
const http = require("http");
const path = require("path");
const formidable = require("formidable");

const PORT = process.env.PORT || 4000;
const hostname = "localhost";
const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    const indexFile = fs.readFileSync("./index.html");
    res.write(indexFile);
    res.end();
  } else if (req.url === "/postData" && req.method === "POST") {
    const form = new formidable.IncomingForm();
    console.log(form);
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.end(err);
      } else {
        fs.mkdir(
          path.join(__dirname, `./resources/${fields?.email}`),
          (err) => {
            if (err) {
              return console.error(err);
            }
            console.log("Directory created successfully!");
          }
        );
        fs.writeFileSync(
          `./resources/${fields?.email}/${fields?.name}.json`,
          JSON.stringify(fields)
        );

        // getting photo name and photo path
        const fileName = files?.photo?.originalFilename;
        const tempPath = files?.photo?.filepath;

        // getting file extension
        let ext = path.extname(fileName);

        fs.renameSync(
          tempPath,
          `${__dirname}/resources/${fields?.email}/profile${ext}`
        );
        res.end("Thanks for submitting data");
      }
    });
  }
});

server.listen(PORT, hostname, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Server is running at http://${hostname}:${PORT}`);
  }
});
