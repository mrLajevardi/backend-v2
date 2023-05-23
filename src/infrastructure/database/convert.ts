/*
Because Engities in mssql and sqlite are different, 
and we need these entities in sqlite for creating in memory tests, 
so we need to convert all of entities effortlessly. 
This script is responsible for that. 
*/

const fs = require("fs");
const path = require("path");

// Source and destination directories
const sourceDir = "./entities";
const destinationDir = "./test-entities";

// Get a list of files in the source directory
const files = fs.readdirSync(sourceDir);

// Iterate through each file
files.forEach((file) => {
  // Check if the file is a TypeScript entity file
  if (file.endsWith(".ts")) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);

    // Read the content of the source file
    const content = fs.readFileSync(sourcePath, "utf8");

    // Perform the necessary modifications to make it SQLite-compatible
    const modifiedContent = content
      // Modify import statement
      .replace('from "typeorm";', 'from "typeorm";')
      // Update column types
      .replace(/@Column\("uniqueidentifier"/g, '@Column("text"')
      .replace(/@Column\("int"/g, '@Column("integer"')
      .replace(/@Column\("bit"/g, '@Column("boolean"')
      .replace(/@Column\("char"/g, '@Column("varchar"')
      .replace(/@Column\("datetime2"/g, '@Column("datetime"')
      .replace(/@Column\("ntext"/g, '@Column("nvarchar"')

      .replace(/@Column\("datetime"/g, '@Column("datetime"')
      // Remove schema option from @Entity decorator
      .replace(/@Entity\([^)]*\)/g, '@Entity()')
      // Update primaryGeneratedColumn type
      .replace(/@PrimaryGeneratedColumn[^)]*\)/g, '@PrimaryGeneratedColumn({ type: "integer" })');

    // Write the modified content to the destination file
    fs.writeFileSync(destinationPath, modifiedContent);

    console.log(`Converted ${sourcePath} to ${destinationPath}`);
  }
});

console.log("Please remove PK_services record from Config table ");
console.log("Conversion completed.");
