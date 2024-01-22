import { DB_HOST, DB_USERNAME, DB_PASS, DB_NAME } from '@config';

// import { Sequelize } from 'sequelize';
// import path from 'path';

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: path.join(__dirname, 'db.sqlite'),
//     logging: false,
// });

// export default sequelize;

export const dbConnection = {
    url: `mongodb+srv://${DB_USERNAME}:${DB_PASS}@${DB_HOST}/${DB_NAME}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
