import type { MaybePromise } from "@sveltejs/kit/types/helper"
import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks"
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import Jimp from 'jimp'
import path from 'path'
import { resizedImagePathPrefix } from "./common"

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
        const fileExtName = path.extname(requestPath)
        const quality = parseInt(path.basename(requestPath, fileExtName))
        switch (quality)
        {
            case 720: case 500: case 200: case 50: break
            default: throw new Error(`Quality: ${quality} is unexpected.`)
        }
        const originalPath = `${path.dirname(requestPath).substring(`/${resizedImagePathPrefix}/`.length)}${fileExtName}`
        const originalFilename = path.join('./static', originalPath)

        if (!existsSync(originalFilename)) return await resolve(request)

        path.join()
        const cacheFilename = path.join('./static', requestPath)
        const cacheDirname = path.dirname(cacheFilename)
        await mkdir(cacheDirname, { recursive: true })
        const modifiedJimpObject = await Jimp.read(originalFilename).then((value) =>
            value.getWidth() > value.getHeight() ?
                value.resize(quality, Jimp.AUTO) :
                value.resize(Jimp.AUTO, quality)
        )
        await modifiedJimpObject.writeAsync(cacheFilename)

        return {
            status: 302,
            headers: { "Location": request.url.toString() }
        }
    }

    return null
}