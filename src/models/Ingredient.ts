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

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
