const app = require('./app');
const { DATASOURCE } = require('./config');
const { DB_NAME, DB_USER } = require('./DB/db.config');
const envConfig = require('./config');
const PORT = process.env.PORT || 8080;

const DATASOURCE_BY_ENV = {
  mongo: require('./models/containers/mongo.container'),
};

const dataSource = DATASOURCE_BY_ENV[envConfig.DATASOURCE];

app.listen(PORT, () => {
  dataSource.connect().then(() => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Connected to ${envConfig.DATASOURCE}`);
    console.log(`Using ${DB_NAME.toUpperCase()} database with ${DB_USER.toUpperCase()} user`);
  });
});
