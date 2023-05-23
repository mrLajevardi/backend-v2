import * as fs from 'fs';
import * as path from 'path';

const JSON_CONFIG_FILENAME = 'config.json';

export default () => {
  const p = path.join(__dirname,".");
  console.log(p);
  const filePath = path.join(__dirname,  JSON_CONFIG_FILENAME);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const config = JSON.parse(fileContents);
  console.log(config);
  return config;
};
