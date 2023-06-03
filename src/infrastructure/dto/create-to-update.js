const fs = require('fs');
const path = require('path');

// Source and destination directories
const createFolder = path.join(__dirname, 'create');
const updateFolder = path.join(__dirname, 'update');

// Read the files in the create folder
fs.readdir(createFolder, (err, files) => {
  if (err) {
    console.error('Error reading create folder:', err);
    return;
  }

  // Process each file
  files.forEach((file) => {
    // Read the contents of the create DTO file
    const createFilePath = path.join(createFolder, file);
    const createFileContents = fs.readFileSync(createFilePath, 'utf8');

    // Add question mark to all fields
    const updateFileContents = createFileContents.replace(
      /@IsOptional\(\)\n\s+([^@\n\s]+):/g,
      '@IsOptional()\n  $1?:'
    );

    // Modify the class name and file name to update
    const updateFileContentsWithClassRename = updateFileContents
      .replace(/Create/g, 'Update')
      .replace(/create/g, 'update');

    // Generate the file name for the update DTO
    const updateFileName = file.replace(/Create/g, 'Update').replace(/create/g, 'update');
    const updateFilePath = path.join(updateFolder, updateFileName);

    // Write the updated contents to the update DTO file
    fs.writeFileSync(updateFilePath, updateFileContentsWithClassRename, 'utf8');
  });

  console.log('Conversion complete!');
});
