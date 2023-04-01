import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  unitWeight: {
    type: Number,
    required: true,
  },
});

const Recipe = mongoose.model('Ingredient', ingredientSchema);

export default Recipe;
