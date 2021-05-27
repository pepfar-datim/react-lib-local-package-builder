import {spawn} from "child_process";
import {attachConsole, OutputType, processOutput} from "./output";
var cpx = require("cpx");

const outputProcessor = (data:string|Buffer)=>{
    if (typeof data==='string') return data;
    if (Buffer.isBuffer(data)) return data.toString();
    return 'Cannot process output';
}

export function buildWatch(packageName:string, rootPath:string){
    console.log(`${rootPath}/${packageName}`);
    let process = spawn('npm',['start'],{cwd: `${rootPath}/${packageName}`});
    attachConsole(process,'npm build', outputProcessor);
}

export function copyWatch(packageName:string, rootPath:string){
    let process = cpx.watch(`${rootPath}/${packageName}/dist/**/*`, `node_modules/@pepfar-react-lib/${packageName}/dist`);
    process.on('copy', processOutput('cpx',OutputType.info, (data:any)=>`Copied ${data.srcPath}`))
}

export function buildWatchPackage(packageName:string, rootPath:string){
    buildWatch(packageName, rootPath);
    copyWatch(packageName, rootPath);
}