import type { Handle } from '@sveltejs/kit'
import cookie from 'cookie'
import { makeid } from '../modules/makeid'
import { ResizeImageHook } from './plugins/resize/hook'

export const handle: Handle = async ({ request, resolve }) =>
{
	const cookies = cookie.parse(request.headers.cookie || '')
	request.locals.deviceId = cookies.deviceid || makeid(16)

	// TODO https://github.com/sveltejs/kit/issues/1046
	if (request.url.searchParams.has('_method'))
	{
		request.method = request.url.searchParams.get('_method').toUpperCase()
	}

	const resizeResult = await ResizeImageHook(request, resolve)
	if (resizeResult) return resizeResult

	const response = await resolve(request)

	if (!cookies.deviceid)
	{
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers['set-cookie'] = `deviceid=${request.locals.deviceId}; Path=/; HttpOnly`
	}

	return response
}
