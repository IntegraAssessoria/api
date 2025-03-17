import { envConfig } from 'src/environment/env';

export const jwtConstants = {
	secret: envConfig.JWT_SECTRET,
	expires: `${envConfig.JWT_EXPIRES}s`,
};
