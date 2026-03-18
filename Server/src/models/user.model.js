const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageProfile: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/4792/4792929.png",
    },
    accountStatus: {
      type: String,
      enum: ["Free", "Picado", "Pro", "Premium"],
      default: "Free",
    },
    role: {
      type: String,
      enum: ["admin", "owner", "employee", "user"],
      default: "user",
    },
    emprendimiento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emprendimiento", // Conexión con el modelo Emprendimiento
      default: null, // Si el usuario no tiene, será null
    },
    mercadoPagoToken: {
      type: String,
      default: null,
    },
    mercadoPagoUserId: {
      type: String, 
      default: null,
    },
    mercadoPagoPayerId: {
      type: String,
      default: null,
    },
    subscriptionId: {
      type: String,
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "pending", "cancelled"],
      default: "inactive",
    },
    pendingSubscription: {
      planId: String,
      planType: String,
      timestamp: Date,
      userId: String
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
