import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config({ quiet: true });

const URL_LISTA_M3U = process.env.URL_LISTA_M3U!;

export const downloadFile = async (): Promise<Buffer> => {
  // Scarico il file direttamente dal link come ArrayBuffer
  const response = await axios.get(URL_LISTA_M3U, {
    responseType: "arraybuffer",
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
  });

  const buffer = Buffer.from(response.data);

  return buffer;
};
