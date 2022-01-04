import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { readdir, mkdir } from "fs/promises"
import { existsSync } from 'fs'
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
        if (existsSync(showsDirname)) await mkdir(showsDirname, { recursive: true })
        const name = req.url.searchParams.get('name')
        const showFiles = Object.fromEntries(await Promise.all((await readdir(`${showsDirname}/${name}`, { encoding: 'utf-8', withFileTypes: true }))
            .filter((file) => file.isDirectory())
            .map(async (showDir) =>
            {
                const filenames = await readdir(`${showsDirname}/${name}/${showDir.name}`)
                return [showDir.name, {
                    image: {
                        before: `${showsDirnamePublic}/${name}/${showDir.name}/${filenames.find((filename) => filename.startsWith('before.'))}`,
                        after: `${showsDirnamePublic}/${name}/${showDir.name}/${filenames.find((filename) => filename.startsWith('after.'))}`
                    }
                }]
            })))

        return {
            name,
            details: '',
            images: showFiles
        } as Show
    })
}