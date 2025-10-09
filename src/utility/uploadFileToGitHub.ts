import axios from "axios";
import { logger } from "../logger/logger";
import * as dotenv from "dotenv";
dotenv.config({ quiet: true });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;

export const uploadFileToGitHub = async (buffer: Buffer, githubPath: string): Promise<void> => {
  const base64Content = buffer.toString("base64");

  // Recupero SHA se esiste
  let sha: string | undefined;
  try {
    const { data } = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubPath}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });
    sha = data.sha;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status !== 404) {
        throw error; // altri errori Axios
      } else {
        // 404 -> file non esiste, tutto ok
        logger.debug(`Il file non esiste. Proseguire con l'upload.`);
      }
    } else {
      // errore generico
      throw error;
    }
  }

  // Carico/aggiorno file
  await axios.put(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${githubPath}`,
    {
      message: "Aggiornamento automatico playlist da bot Telegram",
      content: base64Content,
      sha,
    },
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
};
