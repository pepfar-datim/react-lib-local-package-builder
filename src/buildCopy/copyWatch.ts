import {OutputType, processOutput} from "./output";
import {rmdir} from "fs";
var cpx = require("cpx");
const jsonfile = require("jsonfile");

const localPath = (packageName:string)=>`node_modules/@pepfar-react-lib/${packageName}`;
const remotePath = (rootPath:string, packageName:string)=>`${rootPath}/${packageName}`;

async function getPeerDependencies(rootPath: string, packageName:string):Promise<string[]>{
    let pjson = await jsonfile.readFile(remotePath(rootPath,packageName)+'/package.json')
    if (!pjson) throw new Error(`Cannot open package.json for ${packageName}`);
    if (!pjson.peerDependencies) return []
    console.log(`peerDependencies for ${packageName}:`)
    console.log(Object.keys(pjson.peerDependencies));
    return Object.keys(pjson.peerDependencies);
}

function deletePeerDependencies(packageName:string,peerDependencies:string[]){
    peerDependencies.forEach(dep=>{
        let packagePath = localPath(packageName)+'/node_modules/'+dep;
        rmdir(packagePath,{recursive: true}, function(){
            console.log(`Deleted ${packagePath}`);
        })
    })
}

async function initCopy(rootPath:string, packageName:string):Promise<void>{
    let peerDependencies:string[] = await getPeerDependencies(rootPath, packageName);
    let source = remotePath(rootPath, packageName);
    let destination = localPath(packageName);
    cpx.copy(source+'/package.json', destination);
    cpx.copy(source+'/node_modules/**/*', destination+'/node_modules', function(){
        console.log('delete');
        deletePeerDependencies(packageName, peerDependencies);
    });
}

export async function copyWatch(packageName:string, rootPath:string){
    await initCopy(rootPath, packageName);
    console.log(`cpx from ${remotePath(rootPath, packageName)+'/dist/**/*'} to ${localPath(packageName)+'/dist'}`);
    let process = cpx.watch(remotePath(rootPath, packageName)+'/dist/**/*', localPath(packageName)+'/dist');
    cpx.watch(remotePath(rootPath, packageName)+'/src/**/*', localPath(packageName)+'/src');
    process.on('copy', processOutput('cpx',OutputType.info, (data:any)=>`Copied ${data.srcPath}`))
}