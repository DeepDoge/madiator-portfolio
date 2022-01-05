import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { mkdir, readdir } from "fs/promises"
import path from 'path'
import { api } from "./_api"
import { showsDirname, showsDirnamePublic } from "./_config"

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

        await mkdir(showsDirname, { recursive: true })
        const name = req.url.searchParams.get('name')
        const showImagesDirname = path.join(showsDirname, name, 'images')
        const showImagesDirnamePublic = path.join(showsDirnamePublic, name, 'images')
        const showFiles = Object.fromEntries((await Promise.all((await readdir(showImagesDirname, { encoding: 'utf-8', withFileTypes: true }))
            .filter((file) => file.isDirectory())
            .map(async (imageDir) =>
            {
                const filenames = await readdir(path.join(showImagesDirname, imageDir.name))
                const beforeBasename = filenames.find((filename) => filename.startsWith('before.'))
                const afterBasename = filenames.find((filename) => filename.startsWith('after.'))
                if (!beforeBasename || !afterBasename) return null
                return [imageDir.name, {
                    image: {
                        before: path.join(showImagesDirnamePublic, imageDir.name, beforeBasename),
                        after: path.join(showImagesDirnamePublic, imageDir.name, afterBasename)
                    }
                }]
            }))).filter((show) => show))

        return {
            name,
            details: '',
            images: showFiles
        } as Show
    })
}