import { exec } from 'child_process';

export default function cloneRepository (repositoryUrl: string, folderDest: string) {
  return new Promise((resolve, reject) => {
    // we should use spawn instead to be able to show the processing
    // but i don't find the vscode api to do that
    // ... so we will just use exec for now
    const httpsRepositoryUrl = `https${repositoryUrl.substring(repositoryUrl.indexOf('://'))}`;
    exec(`git clone ${httpsRepositoryUrl}`, { cwd: folderDest }, (err) => {
      if (err) { reject(err); }
      else     { resolve(true); }
    });
  });
}
