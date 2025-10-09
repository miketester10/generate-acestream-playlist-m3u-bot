export const editFile = (buffer: Buffer, host: string): Buffer => {
  // Modifico il contenuto come stringa
  let contentStr = buffer.toString("utf-8");
  contentStr = contentStr.replace(/127\.0\.0\.1/g, host);

  // Riconverto in Buffer
  const modifiedBuffer = Buffer.from(contentStr, "utf-8");

  return modifiedBuffer;
};
