import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Alert = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  freetId: Types.ObjectId;
  dateCreated: Date;
  value: number;
  dateModified: Date;
};

export type PopulatedAlert = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  freetId: Types.ObjectId;
  dateCreated: Date;
  value: number;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AlertSchema = new Schema<Alert>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The value of the alert
  value: {
    type: Number,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const AlertModel = model<Alert>('Alert', AlertSchema);
export default AlertModel;
