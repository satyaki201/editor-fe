/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import JSZip from "jszip";
import { type ChangeEvent } from "react";

const Explorer = () => {
  // console.log(zip,"zipFileName");
  const getFileTree = (
    file: any,
    root: Map<string, Array<Map<string, any>>>,
    current: string,
    i: number
  ): void => {
    const getEachNode = file?.name?.split("/");
    if (i >= getEachNode.length) return;
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
      if (i === getEachNode.length - 1 && !file.dir) {
        foundChildMap.set(toSearch, file);
        children.push(foundChildMap);
        root.set(current, children);
        return;
      }
      foundChildMap.set(toSearch, []);
      children.push(foundChildMap);
      root.set(current, children);
    }
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

    console.log(root);
  };
  return (
    <>
      <label>
        Insert Zip
        <input type="file" accept=".zip" onChange={handleChange} />
      </label>
    </>
  );
};
export default Explorer;
