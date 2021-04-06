import {spawn,ChildProcess} from "child_process";
import {blue, green, red} from "chalk";


enum OutputType {
    info='Info',
    error='Error'
}

const processOutput = (name:string, type:OutputType)=>(data:any)=>{
    let output:string;
    if (typeof data==='string') output=data;
    else if (data.toString) output=data.toString();
    else output=`Cannot process output`
    console.log(blue(name),type===OutputType.error?red('Error'):green('Info'), output);
}

function attachConsole(process:ChildProcess, name:string){
    if (!process||!process.stdout||!process.stderr) throw new Error(`stdout/stderr not available`);
    process.stdout.on('data', processOutput(name, OutputType.info));
    process.stderr.on('data', processOutput(name, OutputType.error));
}

function buildWatch(packageName:string, rootPath:string){
    console.log(`${rootPath}/${packageName}`);
    let process = spawn('npm',['start'],{cwd: `${rootPath}/${packageName}`});
    attachConsole(process,'npm build');
}

function copyWatch(packageName:string, rootPath:string){

}

export function buildWatchPackage(packageName:string, rootPath:string){
    buildWatch(packageName, rootPath);
    copyWatch(packageName, rootPath);
}