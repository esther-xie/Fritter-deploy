import type {HydratedDocument, Types} from 'mongoose';
import type {Dom} from './model';
import DomModel from './model';
import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to interact with doms stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class DomCollection {
  /**
   * Add a new dom
   *
   * @param {string} userId - The id of the owner of the dom
   * @param {string} domname - The name of the dom
   * @param {string} displayedname - The displayed name of the dom
   * @param {string} description - The description of the dom
   * @return {Promise<HydratedDocument<Dom>>} - The newly created dom
   */
  static async addOne(userId: Types.ObjectId | string, domname: string, displayedname: string, description: string): Promise<HydratedDocument<Dom>> {
    const date = new Date();
    const dom = new DomModel({
      userId,
      dateCreated: date,
      domname,
      displayedname,
      description,
      dateModified: date
    });
    await dom.save(); // Saves dom to MongoDB
    return dom.populate('userId');
  }

  /**
   * Find a dom by domId.
   *
   * @param {string} domId - The id of the dom to find
   * @return {Promise<HydratedDocument<Dom>> | Promise<null>} - The dom with the given domID, if any
   */
  static async findOne(domId: Types.ObjectId | string): Promise<HydratedDocument<Dom>> {
    return DomModel.findOne({_id: domId}).populate('userId');
  }

  /**
   * Find a dom by dom name (case insensitive).
   *
   * @param {string} domname - The name of the dom to find
   * @return {Promise<HydratedDocument<Dom>> | Promise<null>} - The dom with the given name, if any
   */
  static async findOneByDomname(domname: string): Promise<HydratedDocument<Dom>> {
    return DomModel.findOne({domname: new RegExp(`^${domname.trim()}$`, 'i')});
  }

  /**
   * Get all the doms under the given user
   *
   * @param {string} username - The username of ownder of the doms
   * @return {Promise<HydratedDocument<Dom>[]>} - An array of all of the doms
   */
   static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Dom>>> {
    const author = await UserCollection.findOneByUsername(username);
    return DomModel.find({userId: author._id}).populate('userId');
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
  static async updateOne(userId: Types.ObjectId | string, domname: string, displayedname: string, description: string): Promise<HydratedDocument<Dom>> {
    const dom = await DomModel.findOne({_id: domId});
    dom.domname = domname;
    dom.displayedname = displayedname;
    dom.description = description;
    dom.dateModified = new Date();
    await dom.save();
    return dom;
    return dom.populate('userId');
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
   * @param {string} userId - The id of author of doms
   */
   static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await DomModel.deleteMany({userId});
  }
}

export default DomCollection;
