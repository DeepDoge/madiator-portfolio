import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { Dirent, readdir, mkdir } from "fs"
import { api } from "./_api"

export interface Show
{
    name: string
    details: string
    images: Record<string, {
        image: {
            before: string
            after: string
        }
    }>
}

export const get: RequestHandler<Locals> = async (req: ServerRequest) =>
{
    return await api(async () =>
    {
        await new Promise((r) => mkdir('./static/shows', r))
        const name = req.url.searchParams.get('name')
        const showFiles = Object.fromEntries((await new Promise<Dirent[]>((resolve, reject) => 
            readdir(`./static/shows/${name}`, { encoding: 'utf-8', withFileTypes: true }, (err, files) => err ? reject(err) : resolve(files))))
            .filter((file) => file.isDirectory())
            .map((file) => ([file.name, {
                image: {
                    before: `/shows/${name}/${file.name}/before.jpg`,
                    after: `/shows/${name}/${file.name}/after.jpg`
                }
            }])))

        return {
            name,
            details: '',
            images: showFiles
        } as Show
    })
}