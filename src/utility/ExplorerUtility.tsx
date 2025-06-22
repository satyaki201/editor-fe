/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type RCTree={
    name:string,
    isFile:boolean,
    children?:Array<RCTree>
    fileContent:string
    getPath:string
}
/**
 * Recursively converts a nested `Map` structure representing a file/folder hierarchy
 * into an array of `RCTree` objects suitable for rendering in a React component tree.
 *
 * @param nodeMap - A `Map` where each key is a node identifier and the value is an array of child node `Map`s.
 * @param current - The current node identifier to process.
 * @param currentPath - The path string representing the current node's location in the hierarchy (default is "root").
 * @returns A `Promise` that resolves to an array of `RCTree` objects representing the tree structure.
 */
export const convertMapToRCTree = async (
  nodeMap: Map<string, Array<Map<string, any>>>,
  current: string,
  currentPath = "root"
): Promise<RCTree[]> => {
  const childrenMaps: Map<string, any>[] = nodeMap.get(current) || [];
  const result: RCTree[] = [];

//EXAMPLE
//<Root,
//[
// <SRC,
// [
// <MAIN,
// [
// <JAVA,
// [hello.java]
//>]
//>
//]
//>
  for (const child of childrenMaps) { // child is SRC
    for (const [name, value] of child.entries()) { // name is SRC value is the array inside
      const fullPath = `${currentPath}/${name}`;

      if (Array.isArray(value)) { // folder means the value is an array
        result.push({
          name,
          isFile: false,
          fileContent: "",
          getPath: fullPath,
          children: await convertMapToRCTreeFromChildren(value, fullPath), // it gets an array of map
        });
      } else {
        const content = await value.async("string");
        result.push({
          name,
          isFile: true,
          fileContent: content,
          getPath: fullPath,
        });
      }
    }
  }
  console.log(result,"gdf")
  return result;
};


//COPILOT GENERATED 

/**
 * Recursively converts an array of Maps representing file/folder structures into an array of RCTree objects.
 *
 * @param children - An array of Maps, where each Map's key is a file or folder name and the value is either an array (for folders) or an object with an async method to retrieve file content.
 * @param currentPath - The current path in the file tree, used to build the full path for each node.
 * @returns A Promise that resolves to an array of RCTree objects representing the file/folder hierarchy.
 */
const convertMapToRCTreeFromChildren = async (
  children: Map<string, any>[],
  currentPath: string
): Promise<RCTree[]> => {
  const result: RCTree[] = [];

  for (const child of children) {
    for (const [name, value] of child.entries()) {
      const fullPath = `${currentPath}/${name}`;

      if (Array.isArray(value)) {
        result.push({
          name,
          isFile: false,
          fileContent: "",
          getPath: fullPath,
          children: await convertMapToRCTreeFromChildren(value, fullPath), // each time send the array of map what is inside
        });
      } else {
        const content = await value.async("string");
        result.push({
          name,
          isFile: true,
          fileContent: content,
          getPath: fullPath,
        });
      }
    }
  }

  return result;
};


export const toRcTreeData = (nodes: RCTree[]): any => {
  return nodes.map((node) => ({
    key: node.getPath,      
    title: node.name,
    isLeaf: node.isFile,
    children: node.isFile ? undefined : toRcTreeData(node.children ?? []),
  }));
};