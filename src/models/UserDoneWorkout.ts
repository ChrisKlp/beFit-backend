import mongoose from 'mongoose';

const userDoneWorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    userWorkout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserWorkout',
      default: null,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const UserDoneWorkout = mongoose.model(
  'UserDoneWorkout',
  userDoneWorkoutSchema
);

export default UserDoneWorkout;
