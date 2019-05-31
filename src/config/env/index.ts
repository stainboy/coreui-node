import * as dotenv from 'dotenv';
import * as properties from 'java-properties';

dotenv.config();

interface IConfig {
    secrets?: {
        mongo: string;
        redis: string;
    }
    port: string | number;
    database?: {
        MONGODB_URI: string;
        MONGODB_DB_MAIN: string;
        MONGODB_USER: string;
        MONGODB_PASSWD: string;
    };
    redis?: {
        port: number;
        db: number;
        host: string;
    };
    secret: string;
}

const NODE_ENV: string = process.env.NODE_ENV || 'production';

const development: IConfig = {
    secrets: {
        mongo: './mock/mongo.properties',
        redis: './mock/redis.properties',
    },
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || 'de0e1997-cb90-4a15-b61f-6b8c8eb3d7ac'
};

const production: IConfig = {
    secrets: {
        mongo: '/etc/secrets/mongo/mongo.properties',
        redis: '/etc/secrets/redis/redis.properties',
    },
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || '1e3609f3-93e7-489a-a9c7-9d2a53ed34ab'
};

const test: IConfig = {
    port: process.env.PORT || 3000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        MONGODB_DB_MAIN: 'test_users_db',
        MONGODB_USER: process.env.MONGODB_USER || 'root',
        MONGODB_PASSWD: process.env.MONGODB_PASSWD || 'dummy'
    },
    redis: {
        db: parseInt(process.env.REDIS_DB, 10) || 0,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
    },
    secret: process.env.SECRET || '140cd891-6c17-4819-878c-fb9570acbd86'
};

const config: {
    [name: string]: IConfig
} = {
    test,
    development,
    production
};

function loadSecret(cfg: IConfig): IConfig {
    if (NODE_ENV === 'test') {
        return cfg;
    }

    let mongo = properties.of(cfg.secrets.mongo);
    let redis = properties.of(cfg.secrets.redis);

    cfg.database = {
        MONGODB_URI: `mongodb://${mongo.get('MG_HOST')}:${mongo.get('MG_PORT')}/`,
        MONGODB_DB_MAIN: mongo.get('MG_DATABASE'),
        MONGODB_USER: mongo.get('MG_USER'),
        MONGODB_PASSWD: mongo.get('MG_PASSWD')
    }
    cfg.redis = {
        db: redis.getInt('REDIS_DATABASE'),
        port: redis.getInt('REDIS_PORT'),
        host: redis.get('REDIS_HOST')
    }

    return cfg;
}

export default loadSecret(config[NODE_ENV]);
