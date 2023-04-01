import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: false,
    },
    protein: {
      type: Number,
      required: false,
    },
    carbohydrates: {
      type: Number,
      required: false,
    },
    fat: {
      type: Number,
      required: false,
    },
    instructions: {
      type: String,
      required: false,
    },
    ingredients: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Ingredient',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
