
import * as dotenv from "dotenv";

import { itemsRouter } from "./router/router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;

const app = express();


app.use(express.json());
app.use("/api/items", itemsRouter);
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.on('error', (err) => {
    console.error('Server error:', err);
});