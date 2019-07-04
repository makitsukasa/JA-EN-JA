const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const extDir = vscode.extensions.getExtension("boxy.JA-EN-JA").extensionPath;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function execCommand (cmd, callback) {
	exec(cmd, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			console.error(`exec error: ${stderr}`);
			callback(stderr);
		}
		callback(stdout);
	});
}

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

	let googletrans = vscode.commands.registerCommand('extension.googletrans', function () {
		let editor = vscode.window.activeTextEditor; // エディタ取得
		const doc = vscode.window.activeTextEditor.document; // ドキュメント取得
		let text = "";
		// 選択範囲が空でないときは選択範囲のみ
		if(!editor.selection.isEmpty){
			text = doc.getText(editor.selection);
		}
		// 選択範囲が空のときはカーソルがある一行
		else{
			const cursorLine = editor.selection.active.line;
			const startPos = new vscode.Position(cursorLine, 0);
			const endPos = new vscode.Position(cursorLine, 10000);
			const line = new vscode.Selection(startPos, endPos);
			text = doc.getText(line);
		}

		text = text.replace(/\n/g, '\\n').replace(/\^/g, "^^");

		// const fileDir = path.dirname(doc.fileName);

		console.log(extDir);
		let pyPath = path.join(extDir, "translate.py");
		let outputPath = path.join(extDir, "en.txt");
		let command = `python ${pyPath} --ja_en ${text}`;
		console.log(command)

		execCommand(command, function (returnvalue) {
			console.log(returnvalue);
			let ret_nl = returnvalue.replace(/\\n/g, "\n");
			// let text_en = `${ret_nl}\n${new Date().toISOString()}`;
			let text_en = ret_nl

			// write
			fs.writeFile(outputPath, text_en, (err) =>{
				if(err) console.log(err);
			});

			text_en = text_en.replace(/\n/g, '\\n').replace(/\^/g, "^^");;

			pyPath = path.join(extDir, "translate.py");
			outputPath = path.join(extDir, "ja.txt");
			command = `python ${pyPath} --en_ja ${text}`;

			execCommand(command, function(returnvalue) {
				console.log(returnvalue);
				returnvalue = decodeURIComponent(returnvalue);
				console.log(returnvalue);
				let outputPath = path.join(extDir, "ja.txt");
				let ret_nl = returnvalue.replace(/\\n/g, "\n");
				// let text_ja = `${ret_nl}\n${new Date().toISOString()}`;
				let text_ja = ret_nl

				// write
				fs.writeFile(outputPath, text_ja, (err) =>{
					if(err) console.log(err);
				});
			});
		});

	});
	context.subscriptions.push(googletrans);

	let opengoogletrans = vscode.commands.registerCommand('extension.opengoogletrans', function () {
		vscode.workspace.openTextDocument(path.join(extDir, "ja.txt")).then(doc => {
			vscode.window.showTextDocument(doc, {preview : false});
		});
		vscode.workspace.openTextDocument(path.join(extDir, "en.txt")).then(doc => {
			vscode.window.showTextDocument(doc, {preview : false});
		});
	});
	context.subscriptions.push(opengoogletrans);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
