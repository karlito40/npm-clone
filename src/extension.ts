// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import getPackageView from './get-package-view';
import getCurrentWorkspace from './get-current-workspace';
import cloneRepository from './clone-repository';

const mkdir = promisify(fs.mkdir);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('npm-clone.cloneNpmPackage', async () => {
		const currentWorkspace = getCurrentWorkspace();
		if (!currentWorkspace) { return vscode.window.showErrorMessage('This extension need a workspace to works!'); }

		const packageName = await vscode.window.showInputBox({
			placeHolder: 'Provide a package name that you want to inspect (example: "express")',
			prompt: 'Clone a npm package'
		}).then((result) => result?.trim());

		if (packageName?.indexOf(' ') !== -1) {
			return vscode.window.showErrorMessage('Something weird happened. You must have misspell the package. I guess.');
		}

		const packageView: any = await getPackageView(packageName).catch(() => null);
		if (!packageView) {
			return vscode.window.showErrorMessage(`${packageName} not found in NPM`);
		}

		const { repository } = packageView;
		if (!repository) { return vscode.window.showErrorMessage(`${packageName} does not include a repository`); }
		else if (repository.type !== 'git') { return vscode.window.showErrorMessage(`${packageName} is not a GIT repository.`); }
		
		const folderDest = path.join(currentWorkspace.uri.fsPath, '.npm-clone');
		try {
			await mkdir(folderDest, { recursive: true });
		} catch(e) {
			return vscode.window.showErrorMessage(`We could not create the .npm-clone destination folder. That's weird`);
		}
		
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: `Cloning ${packageName} into ${folderDest}...`,
			cancellable: false
		}, async () => {
			try {
				await cloneRepository(repository.url, folderDest);
				vscode.window.showInformationMessage(`${packageName} cloned!`);
			} catch (e) {
				vscode.window.showErrorMessage(`${packageName} could not be cloned`);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
