import { Dirent, readdirSync } from 'fs';
import path, { dirname, join } from 'path';
import { importScript } from 'src/infrastructure/helpers/import-script.helper';
import { TasksConfigsInterface } from './interface/tasks-configs.interface';
import { TaskInterface } from './interface/task.interface';

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
async function initServices(source: string) {
  const subDirectories: string[] = getDirectories(source);
  const dependencies = [];
  const tasksConfigs = {};
  for (const subDirectory of subDirectories) {
    const configFilePath = join(subDirectory, '/config.ts');
    const configFile: TasksConfigsInterface = await importScript(
      configFilePath,
    );

    const targetTask = {
      steps: [],
    };
    tasksConfigs[configFile.taskName] = targetTask;
    for (const step of configFile.steps) {
      targetTask.steps;
    }
  }
}
function taskFactory() {}
const source = join(__dirname, '/tasks');
initServices(source);
