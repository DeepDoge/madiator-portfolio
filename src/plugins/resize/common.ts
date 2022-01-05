import path from 'path-browserify'

export const resizedImagePathPrefix = 'resized'
export function ToResizedPath(pathname: string, quality: 720 | 500 | 200 | 50)
{
    // /Foo/Bar/ScreenShots /Screenshot /500 .jpg
    // /Foo/Bar/ScreenShots /Screenshot .jpg
    const ext = path.extname(pathname)
    const basename = path.basename(pathname, ext)
    const dirname = path.dirname(pathname)
    return path.join('/', resizedImagePathPrefix, dirname, basename, `${quality}${ext}`)
}