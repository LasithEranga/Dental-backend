import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import PatientRoutes from './routes/patient.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/Patients",PatientRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

