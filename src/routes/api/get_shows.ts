import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { readdir, mkdir } from "fs/promises"
import { api } from "./_api"

export interface ShowInfo
{
    name: string
    thumbnail: string
}

export const get: RequestHandler<Locals> = async (req: ServerRequest) =>
{
    return await api(async () =>
    {
        await mkdir('./static/shows')
        const showFiles = await readdir(`./static/shows`, { encoding: 'utf-8', withFileTypes: true })

        return showFiles.map((file) => ({
            name: file.name,
            thumbnail: `/shows/${file.name}/thumbnail.jpg`
        } as ShowInfo))
    })
}