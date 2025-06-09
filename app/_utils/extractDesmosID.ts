export const extractDesmosID = (input: string) => {
  try {
    const url = new URL(input);
    const path = url.pathname;
    return path.split("/").pop(); // get last segment
  } catch {
    return input; // fallback to assuming it's just the hash
  }
};
