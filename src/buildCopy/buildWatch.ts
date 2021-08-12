import {spawn} from "child_process";
import {attachConsole} from "./output";

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