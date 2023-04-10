import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
    default: 'reps',
  },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
