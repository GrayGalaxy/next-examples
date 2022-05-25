import fs from 'node:fs'
import process from 'node:process'
import inquirer from 'inquirer'
import { globby } from 'globby'

const args = process.argv.slice(2)
const isForced = args.includes('-f') || args.includes('--force')
if (args.length > 0 && !isForced) {
	console.warn('\x1b[33mcleanup\x1b[0m: unknown arguments provided')
	process.exit(1)
}

// prettier-ignore
const default_paterns = {
	paths: ['.next', 'next-env.d.ts'],
	modules: ['node_modules', 'yarn.lock', 'package-lock.json', 'pnpm-lock.yaml'],
}

const workspaces = (() => {
	const paths = []
	const ignore = ['scripts', 'node_modules']
	fs.readdirSync(process.cwd()).forEach((path) => {
		if (path.startsWith('.')) return
		if (!fs.statSync(path).isDirectory()) return
		if (!ignore.includes(path)) paths.push(path)
	})
	return paths
})()

// Search file paterns
const getPaterns = (root) => {
	if (!workspaces.includes(root)) return []
	let paterns = default_paterns.paths
	try {
		const cleanuprc = fs.readFileSync(`${root}/.cleanup`)
		const content = cleanuprc.toString().split('\r\n')
		content.forEach((line) => {
			if (line.startsWith('#') || line.trim() === '') return
			paterns.push(line)
		})
	} catch {}
	return paterns.map((p) => `${root}/${p}`)
}

async function cleanup(root) {
	const paterns = getPaterns(root)
	const remove = (path) => fs.rmdirSync(path, { recursive: true })
	for (const patern of paterns) {
		if (fs.existsSync(patern)) remove(patern)
		else (await globby(patern)).forEach(remove)
	}
	if (isForced) {
		for (const path of default_paterns.modules) {
			const root_path = `${root}/${path}`
			if (fs.existsSync(root_path)) remove(root_path)
		}
	}
}

// choose folder to cleanup
const prompt = inquirer.prompt({
	name: 'path',
	type: 'list',
	message: 'Workspace to Clean :',
	choices: ['_ALL_WORKSPACES_', ...workspaces],
})

// run cleanup
prompt.then(({ path }) => {
	if (path !== '_ALL_WORKSPACES_') cleanup(path)
	else workspaces.forEach(cleanup)
})
