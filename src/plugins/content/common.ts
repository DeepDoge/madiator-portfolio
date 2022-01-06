import path from 'path-browserify'

export const resizedImagePathPrefix = 'resized'
export const allowedResizeImageQuality = [720, 500, 200, 50] as const
export type ResizeImageQuality = typeof allowedResizeImageQuality[number]

export function ToResizedPath(pathname: string, quality: ResizeImageQuality)
{
    // /Foo/Bar/ScreenShots /Screenshot.jpg /500 
    // /Foo/Bar/ScreenShots /Screenshot.jpg
    const basename = path.basename(pathname)
    const dirname = path.dirname(pathname)
    return path.join('/', resizedImagePathPrefix, dirname, basename, quality.toString())
}

export interface ImageSize
{
    width: number
    height: number
}

export interface ChunkSizes
{
    row: {
        size: number
        count: number
    }
    column: {
        size: number
        count: number
    }
    totalCount: number
}

export interface ChunksInfo extends ImageSize
{
    chunks: string[][]
    sizes: ChunkSizes
}

export const allowedMaxChunkSizes = [720] as const
export type MaxChunkSize = typeof allowedMaxChunkSizes[number]

export function CalculateSizes(width: number, height: number, maxChunkSize: MaxChunkSize): ChunkSizes
{
    const columnCount = Math.ceil(width / maxChunkSize)
    const rowCount = Math.ceil(height / maxChunkSize)
    const columnSize = width / columnCount
    const rowSize = height / rowCount
    return {
        row: {
            size: rowSize,
            count: rowCount
        },
        column: {
            size: columnSize,
            count: columnCount
        },
        totalCount: columnCount + rowCount
    }
}

export async function GetChunksInfo(pathname: string, maxChunkSize: MaxChunkSize)
{
    const basename = path.basename(pathname)
    const dirname = path.dirname(pathname)
    const chunkDirname = path.join('/', resizedImagePathPrefix, dirname, basename)
    const imageInfo: ImageSize = JSON.parse(await (await fetch(path.join(chunkDirname, `info.json`))).text())
    const sizes = CalculateSizes(imageInfo.width, imageInfo.height, maxChunkSize)
    const result: ChunksInfo = {
        ...imageInfo,
        sizes,
        chunks: []
    }
    for (let x = 0; x < sizes.column.count; x++)
    {
        result.chunks.push([])
        for (let y = 0; y < sizes.row.count; y++)
        {
            const chunkPath = path.join(chunkDirname, `chunk_${maxChunkSize}_${x}_${y}`)
            result.chunks[x].push(chunkPath)
        }
    }

    return result
}