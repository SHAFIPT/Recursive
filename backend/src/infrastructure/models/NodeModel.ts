import mongoose, { Schema, Document } from "mongoose";

export interface INodeDocument extends Document {
  name: string;
  parent?: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const NodeSchema = new Schema<INodeDocument>({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Node", default: null },
  createdAt: { type: Date, default: Date.now },
});

export const NodeModel = mongoose.model<INodeDocument>("Node", NodeSchema);
