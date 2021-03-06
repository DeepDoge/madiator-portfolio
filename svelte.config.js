import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit:
	{
		adapter: adapter({  }),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite:
		{
			server: {
				fs: {
					allow: [
						path.resolve('./content')
					]
				}
			},
			resolve:
			{
				alias:
				{
					"$": path.resolve('./src'),
					"$modules": path.resolve('./modules')
				}
			}
		}
	}
}

export default config
