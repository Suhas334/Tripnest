import mongoose from 'mongoose';
const placeSchema = new mongoose.Schema({ trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true }, name: { type: String, required: true, trim: true, maxlength: 100 }, visitDate: { type: String, required: true }, time: { type: String, default: '' }, cost: { type: Number, default: 0, min: 0 }, visited: { type: Boolean, default: false }, notes: { type: String, default: '', maxlength: 500 } }, { timestamps: true });
export default mongoose.model('Place', placeSchema);
