import mongoose from 'mongoose';
const tripSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, title: { type: String, required: true, trim: true, maxlength: 80 }, destination: { type: String, required: true, trim: true, maxlength: 100 }, startDate: { type: String, required: true }, endDate: { type: String, required: true }, budget: { type: Number, default: 0, min: 0 }, notes: { type: String, default: '', maxlength: 1000 } }, { timestamps: true });
export default mongoose.model('Trip', tripSchema);
