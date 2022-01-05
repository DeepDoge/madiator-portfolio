import type { MaybePromise } from "@sveltejs/kit/types/helper"
import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks"
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import Jimp from 'jimp'
import path from 'path'
import mime from 'mime'
import { ImageChunkInfo, resizedImagePathPrefix } from "./common"

type Locals = Record<string, any>
export async function ResizeImageHook(
    request: ServerRequest<Locals, any>,
    resolve: (request: ServerRequest<Locals, Body>) => MaybePromise<ServerResponse>
): Promise<ServerResponse>
{
    if (request.method === 'GET' && request.url.pathname.startsWith(`/${resizedImagePathPrefix}/`))
    {
        // /Foo/Bar/ScreenShots /Screenshot /500 .jpg
        // /Foo/Bar/ScreenShots /Screenshot .jpg
        const requestPath = decodeURIComponent(request.url.pathname)
        const requestFilename = path.join('./cache', requestPath)
        const requestDirname = path.dirname(requestFilename)

        if (!existsSync(requestFilename))
        {
            const qualityString = path.basename(requestPath)
            const quality: number | 'compress' | string = parseInt(qualityString) || qualityString as any
            switch (quality)
            {
                case 'compress':
                case 720: case 500: case 200: case 50: break
                default:
                    if (typeof quality === 'string')
                    {
                        if (quality.startsWith('chunk_')) break
                    }
                    throw new Error(`Quality: ${quality} is unexpected.`)
            }
            const originalPath = `${path.dirname(requestPath).substring(`/${resizedImagePathPrefix}/`.length)}`
            const originalFilename = path.join('.', originalPath)
            const originalFileExtension = path.extname(originalFilename)

            if (!existsSync(originalFilename)) return

            await mkdir(requestDirname, { recursive: true })
            await Jimp.read(originalFilename).then(async (value) =>
            {
                const width = value.getWidth()
                const height = value.getHeight()
                const imageDirection = width > height ? 'horizontal' : 'vertical'
                switch (quality)
                {
                    case 'compress':
                        await value.quality(90).writeAsync(requestFilename)
                        break

                    default:
                        if (typeof quality === 'string')
                        {
                            if (quality.startsWith('chunk_'))
                            {
                                // chunk_360_0
                                // chunk_360_1
                                // chunk_360_info
                                const parts = quality.split('_')
                                const maxChunkSize = parseInt(parts[1])
                                switch (maxChunkSize)
                                {
                                    case 360: break
                                    default: throw new Error()
                                }


                                let pixelsLeft = height
                                const chunkCount = Math.ceil(pixelsLeft / maxChunkSize)
                                
                                if (parts[2] === 'info.json')
                                {
                                    const infoFilename = path.join(requestDirname, `chunk_${maxChunkSize}_info.json`)
                                    const info: ImageChunkInfo = {
                                        width,
                                        height,
                                        chunkCount
                                    }
                                    if (!existsSync(infoFilename)) await writeFile(infoFilename, JSON.stringify(info))
                                }
                                else 
                                {
                                    const requestedChunkI = parseInt(parts[2])
                                    if (!(requestedChunkI < chunkCount)) throw new Error()

                                    for (let chunkI = 0; chunkI < chunkCount; chunkI++)
                                    {
                                        const chunkSize = pixelsLeft > maxChunkSize ? maxChunkSize : pixelsLeft
                                        pixelsLeft -= chunkSize

                                        const chunkFilename = path.join(requestDirname, `chunk_${maxChunkSize}_${chunkI}`)
                                        if (existsSync(chunkFilename)) continue
                                        await value.clone().crop(0, maxChunkSize * chunkI, width, chunkSize).writeAsync(chunkFilename)
                                    }
                                }
                            }
                        }
                        else if (quality > width && quality > height)
                            await value.writeAsync(requestFilename)
                        else
                            await (imageDirection === 'horizontal' ?
                                value.resize(quality, Jimp.AUTO) :
                                value.resize(Jimp.AUTO, quality)
                            ).writeAsync(requestFilename)
                        break
                }

            })
        }

        return {
            status: 200,
            headers: {
                "Cache-Control": "max-age=604800, must-revalidate",
                "Content-Type": mime.getType(requestDirname)
            },
            body: await readFile(requestFilename)
        }
    }
}