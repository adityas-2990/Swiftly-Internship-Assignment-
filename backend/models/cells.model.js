import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema({
    rowId: { type: Number, required: true },
    colId: { type: Number, required: true },
    value: { type: String, default: '' },
});

// Add a unique index to prevent duplicate (rowId, colId) combinations
cellSchema.index({ rowId: 1, colId: 1 }, { unique: true });

const Cell = mongoose.model('Cell', cellSchema);
export default Cell;
