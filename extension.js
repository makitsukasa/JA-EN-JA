const fs = require('fs'); // ライブラリのimport
const path = require('path');

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});
	context.subscriptions.push(disposable);

	let hoge = vscode.commands.registerCommand('extension.hoge', function () {
		let doc = vscode.window.activeTextEditor.document;
		let text = doc.getText();

		let dir = path.dirname(doc.fileName);
		let outputPath = path.join(dir, "en.txt");

		const cp = require('child_process');
		const command = `cd ${dir} && python translate.py ${text}`;

		const exec = require('child_process').exec;

		(function (cmd, callback) {
			exec(cmd, (error, stdout, stderr) => {
				if (error) {
					console.error(`exec error: ${error}`);
					return;
				}
				callback(stdout);
			});
		})(command, function (returnvalue) {
			text = `${returnvalue}\n${new Date().toISOString()}`;

			// write
			fs.writeFile(outputPath, text, (err) =>{
				if(err) console.log(err);
			});

			// open if not opened
			var opened = vscode.window.visibleTextEditors.find(function(element) {
				return element.document.fileName === outputPath;
			});
			if(!opened){
				vscode.workspace.openTextDocument(outputPath).then(doc => {
					vscode.window.showTextDocument(doc);
				});
			}
		});

	});
	context.subscriptions.push(hoge);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
