import { Dirent, readdirSync } from 'fs';
import path, { dirname, join, posix, relative, sep } from 'path';
import { importScript } from 'src/infrastructure/helpers/import-script.helper';
import { TasksConfigsInterface } from './interface/tasks-configs.interface';
import { TaskInterface } from './interface/task.interface';
import configs from './tasks/increaseVdcResources/config';
function getDirectories(source: string): string[] {
  const dir: Dirent[] = readdirSync(source, { withFileTypes: true });
  const directories: string[] = dir
    .filter((dirent) => {
      return dirent.isDirectory();
    })
    .map((dirent) => {
      return join(source, dirent.name);
    });
  return directories;
}
export async function initServices() {
  const source = join(__dirname, '/tasks');
  const subDirectories: string[] = getDirectories(source);
  const dependencies = [];
  for (const subDirectory of subDirectories) {
    const configFilePath = join(subDirectory, '/config');
    const relativeConfigFilePath =
      './' + relative(__dirname, configFilePath).split(sep).join(posix.sep);
    console.log(relativeConfigFilePath);
    const configFile = await import(relativeConfigFilePath);
    console.log(configFile);
    const config: TasksConfigsInterface = configFile.default;
    for (const step of config.steps) {
      dependencies.push(step);
    }
  }
  console.log(dependencies, '🍗');
  return dependencies;
}
// function taskFactory() {}
