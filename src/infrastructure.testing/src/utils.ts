const path = require('path');

// expects test bundle to be at ./dist/[filename].js
export const projectPath = path.resolve(__dirname, '..');

export const sourcePath = path.resolve(projectPath, 'src');

export async function delay(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve();
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
}