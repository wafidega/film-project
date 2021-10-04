const fs = require("fs");
const deleteFile = (filePath) => {
  console.log("Proses Delete", filePath);
  //fs.exsistSync // untuk mengecek keberadaan si file
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath, (error) => {
      if (error) {
        return error.message("Delete Unsucessful");
      }
    });
  }
  // fs.unlink // menghapus file
};

module.exports = deleteFile;
