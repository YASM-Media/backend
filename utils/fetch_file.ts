const decoder = new TextDecoder("utf-8");

// Fetch file contents from their given paths
const fetchFile = async (filePath: string): Promise<string> =>
  decoder.decode(await Deno.readFile(filePath));

export default fetchFile;
