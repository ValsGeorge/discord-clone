import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ServerRoute from '@routes/servers.route';
import CategoryRoute from '@routes/categories.route';
import ChannelRoute from '@routes/channels.route';

async function bootstrap() {
    validateEnv();
    const routes = [
        new IndexRoute(),
        new UsersRoute(),
        new AuthRoute(),
        new ServerRoute(),
        new CategoryRoute(),
        new ChannelRoute(),
    ];
    const app = new App();
    await app.initialize(routes);
    app.listen();
}

bootstrap();
