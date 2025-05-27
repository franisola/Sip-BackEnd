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
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
    },
    payerEmail: {
      type: String,
    },
    metadata: {
      type: Object,
    },
    rawData: {
      type: Object,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
