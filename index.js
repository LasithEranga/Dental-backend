import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import getConnection from './db_init.js';
import { info } from './config/logger.js';

//import routes
import PatientRoutes from './routes/patient.route.js';
import TreatmentPlanRoutes from './routes/treatmentplan.route.js'
import TeethRoutes from './routes/teeth.route.js'


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use("/Patients",PatientRoutes);
app.use("/Treatment", TreatmentPlanRoutes);
app.use("/Teeth",TeethRoutes);

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
