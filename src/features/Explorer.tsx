/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import JSZip from "jszip";
import { useState, type ChangeEvent } from "react";

const Explorer=()=>{
    // console.log(zip,"zipFileName");
    const getFileTree = (
        file: { dir: string },
        root: Map<string, Array<Map<string, any>>>,
        current: string,
        i: number
      ): void => {
        
        const getEachNode = file?.name?.split('/');
        if(!file.dir&&i==getEachNode.length-1)
        {
            const l=
        }
        if(i>=getEachNode.length)
            return;
        if (!getEachNode || i >= getEachNode.length) return;
      
        const toSearch = getEachNode[i];
        const children: Array<Map<string, any>> = root.get(current) ?? [];
      
        let foundChildMap: Map<string, any> | null = null;
      
        for (const item of children) {
          if (item.has(toSearch)) {
            foundChildMap = item;
            break;
          }
        }
      
        if (!foundChildMap) {
          foundChildMap = new Map<string, any>();
          foundChildMap.set(toSearch, []);
          children.push(foundChildMap);
          root.set(current, children);
        }

        getFileTree(file, foundChildMap, toSearch, i + 1);
      };
      
      
    const handleChange=async(e: ChangeEvent<HTMLInputElement>)=>{
        if (e.target.files) {
            const jsZip = new JSZip();
            const loadedZip = await jsZip.loadAsync(e.target.files[0]);
            const root=new Map();
            root.set("root",[]);
    // Traverse the zip entries
        loadedZip?.forEach((relativePath: any, fileEntry: { dir: any; }) => {
        console.log("📁", relativePath, fileEntry);
        console.log(getFileTree(fileEntry,root,"root",0));
      });
        }
    }
    return(
        <>
        <label>Insert Zip
        <input 
        type="file"
        accept=".zip"
        onChange={handleChange}
        />
        </label>
        </>
    )
}
export default Explorer;