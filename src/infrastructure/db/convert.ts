import * as fs from "fs";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// Function to convert a single file
function convertFile(sourcePath: string, destinationPath: string) {
  // Read the TypeScript file
  const fileContent = fs.readFileSync(sourcePath, "utf-8");

  // Modify the entity class
  const modifiedContent = fileContent
    .replace(/@Index[^;]+;/g, "")
    .replace(/@Entity\([^;]+;/g, "@Entity({ name: \"$1\" })")
    .replace(/@PrimaryGeneratedColumn[^;]+;/g, "@PrimaryGeneratedColumn()")
    .replace(/@Column\("nvarchar"[^;]+;/g, "@Column({ type: \"text\",$1 })");

  // Write the modified content to the destination file
  fs.writeFileSync(destinationPath, modifiedContent, "utf-8");

  console.log(`Converted ${sourcePath} to ${destinationPath}`);
}

// Function to convert files in a directory
function convertFilesInDirectory(sourceDirectory: string, destinationDirectory: string) {
  // Get all TypeScript files in the source directory
  const fileNames = fs.readdirSync(sourceDirectory).filter((fileName) => fileName.endsWith(".ts"));

  // Convert each file
  fileNames.forEach((fileName) => {
    const sourcePath = `${sourceDirectory}/${fileName}`;
    const destinationPath = `${destinationDirectory}/${fileName}`;
    convertFile(sourcePath, destinationPath);
  });
}

// Usage example: Convert all files in the "entities" directory to the "converted-entities" directory
const sourceDirectoryPath = "./entities";
const destinationDirectoryPath = "./test-entities";
convertFilesInDirectory(sourceDirectoryPath, destinationDirectoryPath);
