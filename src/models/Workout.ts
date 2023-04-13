import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  level: {
    type: String,
    required: false,
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
      },
      sets: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
      rest: {
        type: Number,
        required: true,
      },
      order: {
        type: Number,
        required: false,
      },
    },
  ],
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
