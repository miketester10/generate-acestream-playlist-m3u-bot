import { Bot } from "gramio";
import { logger } from "./logger/logger";
import { downloadFile } from "./utility/downloadFile";
import { editFile } from "./utility/editFile";
import { uploadFileToGitHub } from "./utility/uploadFileToGitHub";
import { errorHandler } from "./error/errorHandler";
import * as dotenv from "dotenv";
dotenv.config({ quiet: true });

const BOT_TOKEN = process.env.BOT_TOKEN!;

const bot = new Bot(BOT_TOKEN);
const allowedUsers: number[] = [1045814971];

// Variabili per host e percorsi GitHub
const HOST_LOCAL = process.env.HOST_LOCAL!;
const HOST_REMOTE = process.env.HOST_REMOTE!;
const GITHUB_PATH_LOCAL = process.env.GITHUB_PATH_LOCAL!;
const GITHUB_PATH_REMOTE = process.env.GITHUB_PATH_REMOTE!;

// Gestione comando /start
bot.command("start", (ctx) => {
  ctx.reply("👋 Ciao!");
});

// Gestione comando /update
bot.command("update", async (ctx) => {
  ctx.sendChatAction("upload_document");

  // Controllo se l'utente può usare il bot
  const telegramId = ctx.from?.id!;
  if (!allowedUsers.includes(telegramId)) return await ctx.reply(`❌ You aren't allowed to use this bot.`);

  try {
    // Download del file
    logger.info(`Inizio download del file.`);
    const buffer = await downloadFile();

    // Genero playlist per host locale
    logger.info(`Genero playlist per host locale: ${HOST_LOCAL}`);
    const bufferLocal = editFile(buffer, HOST_LOCAL);

    // Genero playlist per host remoto
    logger.info(`Genero playlist per host remoto: ${HOST_REMOTE}`);
    const bufferRemote = editFile(buffer, HOST_REMOTE);

    // Upload su GitHub (due path distinti)
    logger.info(`Carico playlist locale su GitHub: ${GITHUB_PATH_LOCAL}`);
    await uploadFileToGitHub(bufferLocal, GITHUB_PATH_LOCAL);

    logger.info(`Carico playlist remota su GitHub: ${GITHUB_PATH_REMOTE}`);
    await uploadFileToGitHub(bufferRemote, GITHUB_PATH_REMOTE);

    // Risposta
    logger.info(`File caricati correttamente su GitHub.`);
    await ctx.reply("✅ Playlist locale e remota aggiornate con successo su GitHub!");
  } catch (error) {
    const errorMessage = errorHandler(error);
    await ctx.reply(errorMessage);
  }
});

// Avvia il bot
(async () => {
  try {
    await bot.start();
    logger.info("✅ Bot avviato con successo");
  } catch (error) {
    logger.error(`❌ Errore durante l'avvio del bot: ${(error as Error).message}`);
  }
})();
