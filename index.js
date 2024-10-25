import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import getConnection from './db_init.js';
import { info } from './config/logger.js';

//import routes
import PatientRoutes from './routes/patient.route.js';
import TreatmentPlan from './routes/treatmentplan.route.js'


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use("/Patients",PatientRoutes);
app.use("/Treatment", TreatmentPlan)

getConnection()
  .then(() => {
    app.listen(PORT, () => {
      info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    errorWithData("Failed to connect to the database", { error });
  });

export default app;
