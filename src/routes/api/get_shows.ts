import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { Dirent, readdir } from "fs"
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
        const showFiles = await new Promise<Dirent[]>((resolve, reject) => 
            readdir(`./static/shows`, { encoding: 'utf-8', withFileTypes: true }, (err, files) => err ? reject(err) : resolve(files)))

        return showFiles.map((file) => ({
            name: file.name,
            thumbnail: `/shows/${file.name}/thumbnail.jpg`
        } as ShowInfo))
    })
}