const vscode = require('vscode');

function activate(context) {
    let activeEditor = vscode.window.activeTextEditor;
    const underlineDecoration = vscode.window.createTextEditorDecorationType({
        textDecoration: 'underline red'
    });

    function updateDecorations() {
        if (!activeEditor || activeEditor.document.languageId !== 'markdown') return;

        const text = activeEditor.document.getText();
        const regex = /<u>(.*?)<\/u>/g;
        let decorations = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const startPos = activeEditor.document.positionAt(match.index + 3);
            const endPos = activeEditor.document.positionAt(match.index + 3 + match[1].length);
            decorations.push({ range: new vscode.Range(startPos, endPos) });
        }

        activeEditor.setDecorations(underlineDecoration, decorations);
    }

    if (activeEditor && activeEditor.document.languageId === 'markdown') {
        updateDecorations();
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            if (editor && editor.document.languageId === 'markdown') {
                updateDecorations();
            }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            if (activeEditor && event.document === activeEditor.document && event.document.languageId === 'markdown') {
                updateDecorations();
            }
        })
    );
}

function deactivate() {}

module.exports = { activate, deactivate };
