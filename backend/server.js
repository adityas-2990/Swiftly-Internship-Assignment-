import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import Cell from './models/cells.model.js';

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 5000;

//Add Data To the given cell in the spreadsheet
app.put('/api/cells', async (req, res) => {
    const { rowId, colId, value } = req.body;

    try {
        // Find the cell by rowId and colId and update or create it
        const cell = await Cell.findOneAndUpdate(
            { rowId, colId },                // Search criteria
            { value },                       // Update value
            { new: true, upsert: true }      // Create a new document if not found
        );

        res.status(200).json(cell); // Return the updated or created cell
    } catch (error) {
        console.error('Error in PUT /api/cells:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


//Get the value of the given cell in the spreadsheet

app.get('/api/cells', async (req, res) => {
    try {
        const cells = await Cell.find({});
        res.status(200).json(cells);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

//Delete Row
app.delete('/api/cells/:rowId', async (req, res) => {
    const rowId = req.params.rowId;
    try {
        await Cell.deleteMany({ rowId });
        res.status(200).json({ message: 'Row deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

//Delete Column
app.delete('/api/cells/column/:colId', async (req, res) => {
    const colId = parseInt(req.params.colId, 10); // Ensure colId is an integer

    try {
        // Delete all cells with the specified column index
        await Cell.deleteMany({ colId });
        res.status(200).json({ message: 'Column deleted successfully' });
    } catch (error) {
        console.error('Error deleting column:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

app.get('/api/cells/row/:rowId', async (req, res) => {
    const rowId = parseInt(req.params.rowId, 10);

    try {
        const cells = await Cell.find({ rowId });
        res.status(200).json(cells);
    } catch (error) {
        console.error('Error fetching row data:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

app.get('/api/cells/column/:colId', async (req, res) => {
    const colId = parseInt(req.params.colId, 10);

    try {
        const cells = await Cell.find({ colId });
        res.status(200).json(cells);
    } catch (error) {
        console.error('Error fetching column data:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed: ", error.message);
});
