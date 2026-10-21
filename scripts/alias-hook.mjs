import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const distDir = fileURLToPath(new URL('../dist/', import.meta.url))

export async function resolve(specifier, context, nextResolve) {
	if (specifier.startsWith('@/')) {
		const mapped = pathToFileURL(
			path.join(distDir, specifier.slice(2))
		).href

		return nextResolve(mapped, context)
	}

	return nextResolve(specifier, context)
}
