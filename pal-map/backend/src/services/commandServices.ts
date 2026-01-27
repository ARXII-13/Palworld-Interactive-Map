import { join } from "path";
import { promises as fsPromise } from "fs";

import logger from "../utils/logger.js";

const COMMAND_DIRECTLYORY = "\\Mods\\PalworldInteractiveMap";
const COMMAND_FILE_NAME = "command.txt";

async function writeCommandToFile(ue4ssFolder: string, command: string): Promise<void> {
    try {
        const filePath = join(ue4ssFolder, COMMAND_DIRECTLYORY, COMMAND_FILE_NAME);
        await fsPromise.writeFile(filePath, command, "utf8");
    } catch (err) {
        logger.error(`[CheatService] Failed to write command file: ${err}`);
    }
}

export async function teleportToLocation(
    ue4ssFolder: string,
    x: number,
    y: number,
    z: number
): Promise<void> {
    const command = `teleport ${x} ${y} ${z}`;
    await writeCommandToFile(ue4ssFolder, command);
}

export async function updateAllActor(ue4ssFolder: string): Promise<void> {
    const command = `updateActors`;
    await writeCommandToFile(ue4ssFolder, command);
}
