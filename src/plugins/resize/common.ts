import path from 'path-browserify'

export const resizedImagePathPrefix = 'resized'
export function ToResizedPath(pathname: string, quality: 720 | 500 | 200 | 50 | 'compress')
{
    // /Foo/Bar/ScreenShots /Screenshot.jpg /500 
    // /Foo/Bar/ScreenShots /Screenshot.jpg
    const basename = path.basename(pathname)
    const dirname = path.dirname(pathname)
    return path.join('/', resizedImagePathPrefix, dirname, basename, quality.toString())
}

export interface ImageChunkInfo
{
    width: number
    height: number
    chunkCount: number
}

export async function GetChunkInfo(pathname: string, size: 360)
{
    const basename = path.basename(pathname)
    const dirname = path.dirname(pathname)
    const chunkDirname = path.join('/', resizedImagePathPrefix, dirname, basename)
    const infoPath = path.join(chunkDirname, `chunk_${size}_info.json`)
    const info: ImageChunkInfo = JSON.parse(await (await fetch(infoPath)).text())
    const chunkPaths: string[] = []
    for (let i = 0; i < info.chunkCount; i++) chunkPaths.push(path.join(chunkDirname, `chunk_${size}_${i}`))
    return {
        width: info.width,
        height: info.height,
        chunkSize: size,
        images: chunkPaths
    }
}