import { loadEnv } from '../src/utils';
import * as fs from 'fs';

jest.mock('fs');

describe('loadEnv', () => {
	it('should load environment variables from a file', () => {
		const mockReadFileSync = fs.readFileSync as jest.Mock;
		mockReadFileSync.mockReturnValue('TEST_VAR=123\nANOTHER_VAR=456');

		loadEnv('.env');

		expect(process.env.TEST_VAR).toBe('123');
		expect(process.env.ANOTHER_VAR).toBe('456');
	});
});
