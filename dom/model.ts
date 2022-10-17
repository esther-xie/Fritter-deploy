import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Dom
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type Dom = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  domname: string;
  displayedname: string;
  description: string;
  dateCreated: Date;
  dateModified: Date;
};

export type PopulatedDom = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  domname: string;
  displayedname: string;
  description: string;
  dateCreated: Date;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Doms stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const DomSchema = new Schema({
  // The userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The dom's name
  domname: {
    type: String,
    required: true
  },
  // The dom's displayed name
  displayedname: {
    type: String,
    required: false
  },
  // The dom's description
  description: {
    type: String,
    required: false
  },
  // The date the dom was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the dom was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const DomModel = model<Dom>('Dom', DomSchema);
export default DomModel;
