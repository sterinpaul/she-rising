import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
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
    images: [
      {
        type: String, // URLs of images uploaded to Cloudinary
        required: false,
      },
    ],
    author: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
      enum: [
        "Education",
        "Health",
        "STEM",
        "Community",
        "Mental Health",
        "Technology",
        "Media",
        "Sustainability",
        "Digital",
        "Feminism",
        "Environment",
        "Policy",
        "Activism",
        "Culture",
        "Economics",
        "Academic",
        "Global",
      ],
    },
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
articleSchema.index({ category: 1 });
articleSchema.index({ title: "text", content: "text" }); // Text search index

const Article = mongoose.model("Article", articleSchema);

export default Article;
