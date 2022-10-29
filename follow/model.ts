import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Dom} from '../dom/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  follower: Types.ObjectId;
  followingdom: Types.ObjectId;
  dateCreated: Date;
};

export type PopulatedFollow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  follower: User;
  followingdom: Dom;
  dateCreated: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // The author userId
  follower: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Uer'
  },
  // The domId
  followingdom: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Dom'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
