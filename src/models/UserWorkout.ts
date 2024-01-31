import mongoose from 'mongoose';

const userWorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    workoutA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      default: null,
    },
    workoutB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      default: null,
    },
    workoutC: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      default: null,
    },
    doneWorkouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDoneWorkout',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserWorkout = mongoose.model('UserWorkout', userWorkoutSchema);

export default UserWorkout;
