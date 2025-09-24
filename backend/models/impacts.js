import mongoose from "mongoose";

const impactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    images: [
      {
        type: String, // URLs of images uploaded to Cloudinary
        required: false,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
impactSchema.index({ isActive: 1, createdAt: -1 });
impactSchema.index({ title: "text", content: "text" }); // Text search index

const Impact = mongoose.model("Impact", impactSchema);

export default Impact;