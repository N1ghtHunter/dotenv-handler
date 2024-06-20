import * as fs from 'fs';
import * as path from 'path';

export function loadEnv(filePath: string): void {
	const envPath = path.resolve(filePath);
	const envConfig = fs.readFileSync(envPath, 'utf8');
	const envVars = envConfig.split('\n');

	envVars.forEach((line) => {
		const [key, value] = line.split('=');
		if (key && value) {
			process.env[key.trim()] = value.trim();
		}
	});
}
