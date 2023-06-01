import mongoose from 'mongoose';

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  products: [
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
      isCompleted: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

export default ShoppingList;
