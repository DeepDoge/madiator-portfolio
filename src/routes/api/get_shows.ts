import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { mkdir, readdir } from "fs/promises"
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

        return (await Promise.all(showNames.map(async (showName) =>
        {
            const thumbnailName = (await readdir(`${showsDirname}/${showName}`)).find((file) => file.startsWith('thumbnail.'))
            if (!thumbnailName) return null
            return {
                name: showName,
                thumbnail: `${showsDirnamePublic}/${showName}/${thumbnailName}`
            } as ShowInfo
        }))).filter((showInfo) => showInfo)
    })
}