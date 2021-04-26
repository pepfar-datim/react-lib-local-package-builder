import {blue, green, red} from "chalk";
import {ChildProcess} from "child_process";

export enum OutputType {
    info='Info',
    error='Error'
}

export type OutputProcessor = (data:any)=>string;

export const processOutput = (name:string, type:OutputType, processor:(data:any)=>string)=>(data:any)=>{
    console.log(blue(name),type===OutputType.error?red('Error'):green('Info'), processor(data));
}

export function attachConsole(process:ChildProcess, name:string, processor:OutputProcessor){
    if (!process||!process.stdout||!process.stderr) throw new Error(`stdout/stderr not available`);
    process.stdout.on('data', processOutput(name, OutputType.info, processor));
    process.stderr.on('data', processOutput(name, OutputType.error, processor));
}