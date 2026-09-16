import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocumentItem {
  id: string;
  name: string;
  url?: string;
  type?: string;
  size?: number;
  addedAt: Date;
}

export interface UserResourceItem {
  id: string;
  title?: string;
  url: string;
  addedAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  organization_name: string;
  organization_id: string;
  services: string[];
  subscription: "active" | "inactive";
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  documents: UserDocumentItem[];
  resources: UserResourceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  organization_name: string;
  organization_id: string;
  services: string[];
  subscription: "active" | "inactive";
  isVerified: boolean;
  documents: UserDocumentItem[];
  resources: UserResourceItem[];
  createdAt?: string;
  updatedAt?: string;
}

const UserDocumentSchema = new Schema<UserDocumentItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String },
    type: { type: String },
    size: { type: Number },
    addedAt: { type: Date, default: () => new Date() },
  },
  { _id: false },
);

const UserResourceSchema = new Schema<UserResourceItem>(
  {
    id: { type: String, required: true },
    title: { type: String },
    url: { type: String, required: true },
    addedAt: { type: Date, default: () => new Date() },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    organization_name: { type: String, required: true, trim: true },
    organization_id: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    services: { type: [String], default: [] },
    subscription: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    documents: { type: [UserDocumentSchema], default: [] },
    resources: { type: [UserResourceSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

interface UserLike {
  _id?: unknown;
  id?: string;
  email: string;
  name: string;
  organization_name: string;
  organization_id?: string;
  services?: string[];
  subscription?: "active" | "inactive";
  isVerified?: boolean;
  documents?: UserDocumentItem[];
  resources?: UserResourceItem[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  toObject?: () => UserLike;
}

export function toSafeUser(user: IUser | UserLike): SafeUser {
  const plain: UserLike =
    typeof user.toObject === "function" ? user.toObject() : user;
  const idStr = plain._id ? String(plain._id) : (plain.id ?? "");
  return {
    id: idStr,
    email: plain.email,
    name: plain.name,
    organization_name: plain.organization_name,
    organization_id: plain.organization_id ?? "",
    services: plain.services ?? [],
    subscription: plain.subscription ?? "inactive",
    isVerified: Boolean(plain.isVerified),
    documents: (plain.documents ?? []).map((doc) => ({
      id: doc.id,
      name: doc.name,
      url: doc.url,
      type: doc.type,
      size: doc.size,
      addedAt: doc.addedAt,
    })),
    resources: (plain.resources ?? []).map((res) => ({
      id: res.id,
      title: res.title,
      url: res.url,
      addedAt: res.addedAt,
    })),
    createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : undefined,
    updatedAt: plain.updatedAt ? new Date(plain.updatedAt).toISOString() : undefined,
  };
}

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
