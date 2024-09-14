import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

// Convertir fs.mkdir y fs.writeFile en promesas
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

export async function createProject(uri: vscode.Uri) {
    if (uri.scheme === 'file') {
        const folderPath = uri.fsPath;

        try {
            const projectName = await vscode.window.showInputBox({ prompt: 'Enter the project name' });
            if (projectName) {
                const buildOptions = ['EB (Environment Build)', 'OB (Ocat Build)'];
                const buildType = await vscode.window.showQuickPick(buildOptions, { placeHolder: 'Select build type' });

                if (buildType) {
                    const newProjectPath = path.join(folderPath, projectName);

                    // Crear directorio del proyecto
                    await mkdir(newProjectPath, { recursive: true });

                    // Crear subdirectorio "docs"
                    const docsPath = path.join(newProjectPath, 'docs');
                    await mkdir(docsPath, { recursive: true });

                    // Crear archivo Readme.odoc
                    const readmePath = path.join(docsPath, 'Readme.odoc');
                    const content = `# Orange Cat Project\n\nBuild Type: ${buildType}\n\nWelcome to your new project!`;
                    await writeFile(readmePath, content);

                    // Crear subdirectorio "src"
                    const srcPath = path.join(newProjectPath, 'src');
                    await mkdir(srcPath, { recursive: true });

                    // Crear archivo main.ocat en "src"
                    const mainPath = path.join(srcPath, 'main.ocat');
                    const content2 = `print ( "Hello,%World" )`;
                    await writeFile(mainPath, content2);

                    // Crear subdirectorio ".ocat"
                    const _ocatPath = path.join(newProjectPath, '.ocat');
                    await mkdir(_ocatPath, { recursive: true });

                    // Crear archivo project.ocmn
                    const project_ocmn = path.join(_ocatPath, 'project.ocmn');

                    let projectContent: string;
                    if (buildType === 'EB (Environment Build)') {
                        projectContent = `
<project>
    <version>
        1.0
    <version/>
    <main>
        src/main.ocat
    <main/>
    <sourcePath>
        src
    <sourcePath/>
    <libraries>
        <lib>
            <import>
                .env
            <import/>
            <sourceID>  
                examples
            <sourceID/>
            <orangeID>
                OC-HXZWY82VR
            <orangeID/>
        <lib/>
    <libraries/>
    <build>
        <source>
            .env
        <source/>
        <target>
            .env/builds
        <target/>
        <name>
            ${projectName}
        <name/>
        <exports>
            ocf
        <exports/>
    <build/>
<project/>`;
                        const envPath = path.join(newProjectPath, ".env");
                        await mkdir(envPath, {recursive: true});

                        const localPath = path.join(envPath, "local");
                        await mkdir(localPath, {recursive: true});
                    } else {
                        projectContent = `
<project>
    <version>
        1.0
    <version/>
    <main>
        src/main.ocat
    <main/>
    <sourcePath>
        src
    <sourcePath/>
    <libraries>
        <lib>
            <import>
                global
            <import/>
            <sourceID>
                examples
            <sourceID/>
            <orangeID>
                OC-HXZWY82VR
            <orangeID/>
        <lib/>
    <libraries/>
    <build>
        <source>
            global
        <source/>
        <target>
            .ocat/builds
        <target/>
        <name>
            ${projectName}
        <name/>
        <exports>
            ocf
        <exports/>
    <build/>
<project/>`;
                    }

                    await writeFile(project_ocmn, projectContent);

                    // Notificar al usuario
                    vscode.window.showInformationMessage('Project created successfully!');

                    // Abrir el archivo Readme.odoc
                    const doc = await vscode.workspace.openTextDocument(readmePath);
                    await vscode.window.showTextDocument(doc);
                } else {
                    vscode.window.showWarningMessage('Build type not selected.');
                }
            } else {
                vscode.window.showWarningMessage('Project name not provided.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create project: ${error.message}`);
        }
    } else {
        vscode.window.showErrorMessage('Invalid URI scheme. Please select a folder.');
    }
}
