import type {HydratedDocument, Types} from 'mongoose';
import type {Dom} from './model';
import DomModel from './model';
import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to interact with doms stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Dom> is the output of the DomModel() constructor,
 * and contains all the information in Dom. https://mongoosejs.com/docs/typescript.html
 */
class DomCollection {
  /**
   * Add a dom to the collection
   *
   * @param {string} authorId - The id of the owner of the dom
   * @param {string} domname - The name of the dom
   * @param {string} displayedname - The displayed name of the dom
   * @param {string} description - The description of the dom
   * @return {Promise<HydratedDocument<Dom>>} - The newly created dom
   */
  static async addOne(authorId: Types.ObjectId | string, domname: string, displayedname: string, description: string): Promise<HydratedDocument<Dom>> {
    const date = new Date();
    const dom = new DomModel({
      authorId,
      dateCreated: date,
      domname,
      displayedname,
      description,
      dateModified: date
    });
    await dom.save(); // Saves dom to MongoDB
    return dom.populate('authorId');
  }

  /**
   * Find a dom by domId.
   *
   * @param {string} domId - The id of the dom to find
   * @return {Promise<HydratedDocument<Dom>> | Promise<null>} - The dom with the given domID, if any
   */
  static async findOne(domId: Types.ObjectId | string): Promise<HydratedDocument<Dom>> {
    return DomModel.findOne({_id: domId}).populate('authorId');
  }

    /**
   * Get all the doms in the database
   *
   * @return {Promise<HydratedDocument<Dom>[]>} - An array of all of the doms
   */
     static async findAll(): Promise<Array<HydratedDocument<Dom>>> {
      // Retrieves doms and sorts them from most to least recent
      return DomModel.find({}).sort({dateModified: -1}).populate('authorId');
    }

  /**
   * Find a dom by dom name (case insensitive) and username.
   *
   * @param {string} authorId - The username
   * @param {string} domname - The name of the dom to find
   * @return {Promise<HydratedDocument<Dom>> | Promise<null>} - The dom with the given name, if any
   */
  static async findOneByDomnameandUser(authorId: Types.ObjectId | string, domname: string): Promise<Array<HydratedDocument<Dom>>> {
    return DomModel.findOne({authorId: authorId, domname: domname}).populate('dateModified');
  }
  
  /**
   * Get all the doms under the given user
   *
   * @param {string} username - The username of ownder of the doms
   * @return {Promise<HydratedDocument<Dom>[]>} - An array of all of the doms
   */
   static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Dom>>> {
    const author = await UserCollection.findOneByUsername(username);
    return DomModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update dom's information
   *
   * @param {string} domId - The Id of the dom to update
   * @param {string} domname - The new name of the dom
   * @param {string} displayedname - The new displayed name of the dom
   * @param {string} description - The new description of the dom
   * @return {Promise<HydratedDocument<Dom>>} - The updated dom
   */
  static async updateOne(domId: Types.ObjectId | string, domname: string, displayedname: string, description: string): Promise<HydratedDocument<Dom>> {
    const dom = await DomModel.findOne({_id: domId});
    dom.domname = domname;
    dom.displayedname = displayedname;
    dom.description = description;
    dom.dateModified = new Date();
    await dom.save();
    return dom.populate('authorId');
  }

  /**
   * Delete a dom from the collection.
   *
   * @param {string} domId - The Id of dom to delete
   * @return {Promise<Boolean>} - true if the dom has been deleted, false otherwise
   */
  static async deleteOne(domId: Types.ObjectId | string): Promise<boolean> {
    const dom = await DomModel.deleteOne({_id: domId});
    return dom !== null;
  }

  /**
   * Delete all the doms by the given author
   *
   * @param {string} authorId - The id of author of doms
   */
   static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await DomModel.deleteMany({authorId});
  }
}

export default DomCollection;
