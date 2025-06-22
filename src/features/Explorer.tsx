/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import JSZip from "jszip";
import {convertMapToRCTree,toRcTreeData} from '../utility/ExplorerUtility'
import type {RCTree} from '../utility/ExplorerUtility'
import { type ChangeEvent,useState } from "react";
import Tree from "rc-tree";
/**
 * Explorer component for displaying a file tree structure from a ZIP file.
 *
 * - Allows users to upload a ZIP file and parses its contents into a hierarchical tree.
 * - Uses a recursive function `getFileTree` to build a nested Map representing the file structure.
 * - Converts the Map structure into a format suitable for rendering with a Tree component.
 * - Handles both files and directories, distinguishing between them based on the ZIP entry.
 *
 * @component
 *
 * @example
 * <Explorer />
 *
 * @returns {JSX.Element} The rendered Explorer component with file upload and tree view.
 */
const Explorer = () => {

  const [fileTree,setFileTree]=useState<RCTree[]>();
  /**
   * Recursively builds a file tree structure from a file path.
   *
   * @param file - The file object containing at least a `name` property (path as string).
   * @param root - The root map representing the file tree, where each key is a directory or file name and the value is an array of child maps.
   * @param current - The current directory or file name being processed.
   * @param i - The current index in the split path array.
   *
   * @remarks
   * This function splits the file's name by "/" to traverse or build the nested file tree.
   * It creates new nodes as needed and attaches file objects at leaf nodes (when not a directory).
   */
  const getFileTree = (
    file: any,
    root: Map<string, Array<Map<string, any>>>,
    current: string,
    i: number
  ): void => {
    const getEachNode = file?.name?.split("/"); // you know the file path and the the content
    if (!getEachNode || i >= getEachNode.length || getEachNode[i]=="") return; // did not get any / means done there is nothing and i>= means you are done checking

    const toSearch = getEachNode[i]; //we will check basically if our map have the path
    const children: Array<Map<string, any>> = root.get(current) ?? []; // get the array of map which is the children array of root

    let foundChildMap: Map<string, any> | null = null;

    for (const item of children) { // traverse through it
      if (item.has(toSearch)) { // get to each map and see if exists
        foundChildMap = item; 
        break;
      }
    }
    if (!foundChildMap) { // if not found make it
      foundChildMap = new Map<string, any>();
      if (i === getEachNode.length - 1 && !file.dir) { // if file no need to make another map with
        foundChildMap.set(toSearch, file);
        children.push(foundChildMap);// push the file in the children
        root.set(current, children);
        return;
      }
      foundChildMap.set(toSearch, []);
      children.push(foundChildMap);
      root.set(current, children);
    }//based on the idea that terminal node do not appear twice
    getFileTree(file, foundChildMap, toSearch, i + 1);
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const root = new Map();
    root.set("root", []);
    if (e.target.files) {
      const jsZip = new JSZip();
      const loadedZip = await jsZip.loadAsync(e.target.files[0]);

      // Traverse the zip entries
      loadedZip?.forEach((_: any, fileEntry: { dir: any }) => {
        getFileTree(fileEntry, root, "root", 0);
      });
    }
    console.log(root,"root");
    convertMapToRCTree(root,"root").then((data:any)=>{
      setFileTree(data);
    });

    
  };
  return (
    <>
    <div>
      <label>
        Insert Zip
        <input type="file" accept=".zip" onChange={handleChange} />
      </label>
      <Tree showIcon={true}
      // showLine={true}
      // draggable={true}
      treeData={toRcTreeData(fileTree ?? [])}
      />
      <p>{}</p>
      </div>
    </>
  );
};
export default Explorer;
