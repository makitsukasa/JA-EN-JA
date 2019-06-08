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

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "JA-EN-JA" is now active!');

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
		let editor = vscode.window.activeTextEditor; // エディタ取得
		let doc = editor.document;            // ドキュメント取得
		let cur_selection = editor.selection; // 選択範囲取得
		if(editor.selection.isEmpty){
			// 選択範囲が空であれば全てを選択範囲にする
			let startPos = new vscode.Position(0, 0);
			let endPos = new vscode.Position(doc.lineCount - 1, 10000);
			cur_selection = new vscode.Selection(startPos, endPos);
		}

		let text = doc.getText(cur_selection); //取得されたテキスト

		/**
		 * ここでテキストを加工します。
		 **/
		text += new Date().toISOString();

		outputDir = path.dirname(vscode.window.activeTextEditor.document.fileName);
		outputPath = path.join(outputDir, "en.txt");

		// write
		fs.writeFile(outputPath, text, (err) =>{
			if(err) console.log(err);
		});

		// open
		// if(!vscode.window.visibleTextEditors.find(outputPath)){
		// 	vscode.workspace.openTextDocument(outputPath).then(doc => {
		// 		vscode.window.showTextDocument(doc);
		// 	});
		// }
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
