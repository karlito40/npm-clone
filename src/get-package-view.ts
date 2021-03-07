import { exec } from 'child_process';

export default function getPackageView (packageName: string) {
  return new Promise((resolve, reject) => {
    exec(`npm view ${packageName} --json`, (err, stdout) => {
      if (err) { reject(err); }
      else     { resolve(JSON.parse(stdout)); }
    });
  });
}