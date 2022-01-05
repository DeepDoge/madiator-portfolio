import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { mkdir, readdir } from "fs/promises"
import path from 'path'
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
        await mkdir(showsDirname, { recursive: true })
        const showNames = await readdir(showsDirname)

        return (await Promise.all(showNames.map(async (showName): Promise<ShowInfo> =>
        {
            const thumbnailName = (await readdir(path.join(showsDirname, showName))).find((file) => file.startsWith('thumbnail.'))
            if (!thumbnailName) return null
            return {
                name: showName,
                thumbnail: path.join(showsDirnamePublic, showName, thumbnailName)
            }
        }))).filter((showInfo) => showInfo)
    })
}