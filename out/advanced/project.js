"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const util_1 = require("util");
// Convertir fs.mkdir y fs.writeFile en promesas
const mkdir = (0, util_1.promisify)(fs.mkdir);
const writeFile = (0, util_1.promisify)(fs.writeFile);
function createProject(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (uri.scheme === 'file') {
            const folderPath = uri.fsPath;
            try {
                const projectName = yield vscode.window.showInputBox({ prompt: 'Enter the project name' });
                if (projectName) {
                    const buildOptions = ['EB (Environment Build)', 'OB (Ocat Build)'];
                    const buildType = yield vscode.window.showQuickPick(buildOptions, { placeHolder: 'Select build type' });
                    if (buildType) {
                        const newProjectPath = path.join(folderPath, projectName);
                        // Crear directorio del proyecto
                        yield mkdir(newProjectPath, { recursive: true });
                        // Crear subdirectorio "docs"
                        const docsPath = path.join(newProjectPath, 'docs');
                        yield mkdir(docsPath, { recursive: true });
                        // Crear archivo Readme.odoc
                        const readmePath = path.join(docsPath, 'Readme.odoc');
                        const content = `# Orange Cat Project\n\nBuild Type: ${buildType}\n\nWelcome to your new project!`;
                        yield writeFile(readmePath, content);
                        // Crear subdirectorio "src"
                        const srcPath = path.join(newProjectPath, 'src');
                        yield mkdir(srcPath, { recursive: true });
                        // Crear archivo main.ocat en "src"
                        const mainPath = path.join(srcPath, 'main.ocat');
                        const content2 = `print ( "Hello,%World" )`;
                        yield writeFile(mainPath, content2);
                        // Crear subdirectorio ".ocat"
                        const _ocatPath = path.join(newProjectPath, '.ocat');
                        yield mkdir(_ocatPath, { recursive: true });
                        // Crear archivo project.ocmn
                        const project_ocmn = path.join(_ocatPath, 'project.ocmn');
                        let projectContent;
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
                            yield mkdir(envPath, { recursive: true });
                            const localPath = path.join(envPath, "local");
                            yield mkdir(localPath, { recursive: true });
                        }
                        else {
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
                        yield writeFile(project_ocmn, projectContent);
                        // Notificar al usuario
                        vscode.window.showInformationMessage('Project created successfully!');
                        // Abrir el archivo Readme.odoc
                        const doc = yield vscode.workspace.openTextDocument(readmePath);
                        yield vscode.window.showTextDocument(doc);
                    }
                    else {
                        vscode.window.showWarningMessage('Build type not selected.');
                    }
                }
                else {
                    vscode.window.showWarningMessage('Project name not provided.');
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to create project: ${error.message}`);
            }
        }
        else {
            vscode.window.showErrorMessage('Invalid URI scheme. Please select a folder.');
        }
    });
}
