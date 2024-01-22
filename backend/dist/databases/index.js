import { Sequelize } from "sequelize";
import path from "path";
var sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "db.sqlite"),
    logging: false
});
export default sequelize;

//# sourceMappingURL=index.js.map