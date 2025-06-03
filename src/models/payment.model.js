import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    mercadoPagoId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'in_process', 'cancelled', 'refunded'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String, // Ej: 'credit_card', 'account_money', etc.
    },
    payerEmail: {
      type: String,
    },
    metadata: {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
      cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      fecha: Date,
      animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
      },
      precio: Number,
    },
    rawData: {
      type: Object, // Almacena la respuesta completa del webhook si querés guardar todo.
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
