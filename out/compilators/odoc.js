"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderOdocToHtml = renderOdocToHtml;
exports.getWebviewContent = getWebviewContent;
function renderOdocToHtml(text) {
    // Implementa aquí la lógica para convertir ODoc a HTML
    // Por simplicidad, usaremos expresiones regulares básicas
    let html = text;
    // Convertir títulos
    html = html.replace(/^(#{1,3}|\${1,3})\s+(.*)$/gm, (match, p1, p2) => {
        const level = p1.startsWith('#') ? p1.length : p1.length;
        return `<h${level}>${p2.trim()}</h${level}>`;
    });
    // Convertir negrita
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convertir subrayado
    html = html.replace(/_(.*?)_/g, '<u>$1</u>');
    // Convertir cursiva
    html = html.replace(/\/(.*?)\//g, '<em>$1</em>');
    // Convertir código inline
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    // Convertir enlaces personalizados
    html = html.replace(/!\{(.*?)\}/g, '<img src="$1" alt="Imagen">');
    html = html.replace(/\[(.*?)\]\{(.*?)\}/g, '<a href="$2">$1</a>');
    // Convertir listas desordenadas
    html = html.replace(/^\-\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    // Convertir listas ordenadas
    html = html.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');
    // Convertir definiciones
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<dfn>$1: $2</dfn>');
    // Convertir bloques de clase
    html = html.replace(/^&\s*(.*?)$/gm, '<div class="class-block">');
    html = html.replace(/^%$/gm, '</div>');
    return html;
}
function getWebviewContent(html) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Previsualización ODoc</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .class-block { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
        /* Añade más estilos según tus necesidades */
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
}
