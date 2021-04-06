#!/usr/bin/node

import {existsSync,mkdirSync} from "fs";
import {spawnSync} from "child_process";

function createDir(dirName:string):void{
    if (!existsSync(dirName)) mkdirSync(dirName);
}

function npm(command:string):string{
    let args = command.split(' ');
    let {stdout} = spawnSync('npm',[args[0],args[1]])
    return stdout.toString().replace('\n','');
}

function move(what:string, where:string){
    spawnSync('mv',[what,where]);
}

export function importPackage(path:string):void{
    createDir('local_modules');
    let packageName = npm(`pack ${path}`);
    move(packageName,'local_modules');
    let output = npm(`install ./local_modules/${packageName}`);
    console.log(output);
}