import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { readdir, mkdir } from "fs/promises"
import { existsSync } from 'fs'
import { api } from "./_api"
import { showsDirname, showsDirnamePublic } from "./_config"

export interface ShowInfo
{
    name: string
    thumbnail: string
}

export const get: RequestHandler<Locals> = async (req: ServerRequest) =>
{
    return await api(async () =>
    {
        if (existsSync(showsDirname)) await mkdir(showsDirname, { recursive: true })
        const showFiles = await readdir(showsDirname, { encoding: 'utf-8', withFileTypes: true })

        return showFiles.map((file) => ({
            name: file.name,
            thumbnail: `${showsDirnamePublic}/${file.name}/thumbnail.jpg`
        } as ShowInfo))
    })
}