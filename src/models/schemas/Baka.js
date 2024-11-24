import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const BakaSchema = new Schema({
  _id: { type: Number },
  url: { type: String, required: true, unique: true },
});

export default model('Baka', BakaSchema);
