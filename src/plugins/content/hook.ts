import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks"
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import Jimp from 'jimp'
import mime from 'mime'
import path from 'path'
import { allowedMaxChunkSizes, allowedResizeImageQuality, CalculateSizes, ImageSize, MaxChunkSize, resizedImagePathPrefix, ResizeImageQuality } from "./common"

type Locals = Record<string, any>
export async function ResizeImageHook(
    request: ServerRequest<Locals, any>,
    response: ServerResponse
): Promise<ServerResponse>
{
    if (request.method !== 'GET') return
    if (request.url.pathname.startsWith('/content'))
    {
        Object.assign(response, {
            status: 200,
            headers: {
                "Cache-Control": "max-age=604800, must-revalidate"
            },
            body: await readFile(path.join('.', decodeURIComponent(request.url.pathname)))
        })
    }
    else if (request.url.pathname.startsWith(`/${resizedImagePathPrefix}/`))
    {
        // /Foo/Bar/ScreenShots /Screenshot /500 .jpg
        // /Foo/Bar/ScreenShots /Screenshot .jpg
        const requestPath = decodeURIComponent(request.url.pathname)
        const requestFilename = path.join('./cache', requestPath)
        const requestDirname = path.dirname(requestFilename)

        if (!existsSync(requestFilename))
        {
            const originalPath = `${path.dirname(requestPath).substring(`/${resizedImagePathPrefix}/`.length)}`
            const originalFilename = path.join('.', originalPath)
            const originalFileExtension = path.extname(originalFilename)

            if (!existsSync(originalFilename)) return
            await mkdir(requestDirname, { recursive: true })

            const requestedType = path.basename(requestPath)
            switch (requestedType)
            {
                case 'compress':
                    await Jimp.read(originalFilename).then(async (value) => await value.quality(100).writeAsync(requestFilename))
                    break
                case 'info.json':
                    await Jimp.read(originalFilename).then(async (value) =>
                        await writeFile(path.join(requestDirname, `info.json`),
                            JSON.stringify({ width: value.getWidth(), height: value.getHeight() } as ImageSize)))
                    break
                default:
                    if (requestedType.startsWith('chunk_')) 
                    {
                        await Jimp.read(originalFilename).then(async (value) =>
                        {
                            // chunk_360_0
                            // chunk_360_1
                            // chunk_360_info
                            const parts = requestedType.split('_')
                            const maxChunkSize: MaxChunkSize = parseFloat(parts[1]) as any
                            if (!allowedMaxChunkSizes.includes(maxChunkSize))
                                throw new Error(`Unexpected max chunk size: ${maxChunkSize}`)

                            const width = value.getWidth()
                            const height = value.getHeight()
                            const chunks = CalculateSizes(width, height, maxChunkSize)

                            const requestedChunkX = parseFloat(parts[2])
                            if (requestedChunkX % 1 !== 0) throw new Error()
                            if (!(requestedChunkX < chunks.column.count)) throw new Error()

                            const requestedChunkY = parseFloat(parts[3])
                            if (requestedChunkY % 1 !== 0) throw new Error()
                            if (!(requestedChunkY < chunks.column.count)) throw new Error()

                            for (let x = 0; x < chunks.column.count; x++)
                                for (let y = 0; y < chunks.row.count; y++)
                                {
                                    const chunkFilename = path.join(requestDirname, `chunk_${maxChunkSize}_${x}_${y}`)
                                    if (existsSync(chunkFilename)) continue
                                    await value.clone().crop(
                                        x * chunks.column.size,
                                        y * chunks.row.size,
                                        chunks.column.size,
                                        chunks.row.size
                                    ).writeAsync(chunkFilename)
                                }
                        })
                        break
                    }

                    const quality: ResizeImageQuality = parseFloat(requestedType) as any
                    if (!allowedResizeImageQuality.includes(quality)) throw new Error(`Unexpected quality: ${quality}`)
                    await Jimp.read(originalFilename).then(async (value) =>
                    {
                        const width = value.getWidth()
                        const height = value.getHeight()
                        if (quality > width && quality > height)
                            await value.writeAsync(requestFilename)
                        else
                            await (width > height ?
                                value.resize(quality, Jimp.AUTO) :
                                value.resize(Jimp.AUTO, quality)
                            ).writeAsync(requestFilename)
                    })
                    break
            }
        }

        Object.assign(response, {
            status: 200,
            headers: {
                "Cache-Control": "max-age=604800, must-revalidate",
                "Content-Type": mime.getType(requestFilename) ?? mime.getType(requestDirname)
            },
            body: await readFile(requestFilename)
        })
    }
}