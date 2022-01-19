import * as Bluebird from 'bluebird';

// @ts-ignore
global.Promise = Bluebird;

process.on('unhandledRejection', (up) => { throw up; });
process.on('exit', (code) => {
    console.log(`Exit with code: ${code}`);
});

async function bootstrap() {
    console.log('Bootstrap');
}
bootstrap();
