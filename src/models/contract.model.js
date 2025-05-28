import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Animal',
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    pago: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Contract = mongoose.model('Contract', contractSchema);
export default Contract;


    // estado: {
    //   type: String,
    //   enum: ['activo', 'finalizado', 'cancelado'],
    //   default: 'activo',
    // },