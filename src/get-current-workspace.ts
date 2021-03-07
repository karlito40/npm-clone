import * as vscode from 'vscode';

export default function getCurrentWorkspace () {
  const workspaceFolders = vscode.workspace.workspaceFolders || [];
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return workspaceFolders[0];
  }

  const currentDoc = activeTextEditor.document;
  return workspaceFolders.find(ws => {
    return currentDoc.uri.fsPath.includes(ws.uri.fsPath);
  });
}