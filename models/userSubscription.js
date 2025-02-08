import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    packageName: {
      type: String,
      required: false,
      default: null,
    },
    productId: {
      type: String,
      required: false,
      default: null,
    },
    purchaseToken: {
      type: String,
      required: false,
      default: null,
    },
    orderId: {
      type: String,
      required: false,
      default: null,
    },
    originalTransactionId: {
      type: String,
      required: false,
      default: null,
    },
    purchaseDate: {
      type: Date,
      required: false,
      default: null,
    },
    expiryDate: {
      type: Date,
      required: false,
      default: null,
    },
    autoRenewing: {
      type: Boolean,
      required: false,
      default: false,
    },
    receipt: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },
    cancelledAt: {
      type: Date,
      required: false,
      default: null,
    },
    isFreeTrialUse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSubscription = mongoose.model(
  "UserSubscriptions",
  userSubscriptionSchema
);

export default UserSubscription;
