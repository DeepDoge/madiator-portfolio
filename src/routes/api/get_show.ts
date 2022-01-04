import type { Locals } from "$lib/types"
import type { RequestHandler } from "@sveltejs/kit"
import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import { mkdir, readdir } from "fs/promises"
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
        const showFiles = Object.fromEntries((await Promise.all((await readdir(`${showsDirname}/${name}/images`, { encoding: 'utf-8', withFileTypes: true }))
            .filter((file) => file.isDirectory())
            .map(async (showDir) =>
            {
                const filenames = await readdir(`${showsDirname}/${name}/images/${showDir.name}`)
                const beforeName = filenames.find((filename) => filename.startsWith('before.'))
                const afterName = filenames.find((filename) => filename.startsWith('after.'))
                if (!beforeName || !afterName) return null
                return [showDir.name, {
                    image: {
                        before: `${showsDirnamePublic}/${name}/images/${showDir.name}/${beforeName}`,
                        after: `${showsDirnamePublic}/${name}/images/${showDir.name}/${afterName}`
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