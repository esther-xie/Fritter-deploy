import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import DomCollection from '../dom/collection';


/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} followerId - The id of the author of the freet
   * @param {string} followingdomId - The id of the dom of the freet
   * @return {Promise<HydratedDocument<Follow>>} - The newly created freet
   */
  static async addOne(followerId: Types.ObjectId | string, followingdomId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const date = new Date();
    const follow = new FollowModel({
      follower: followerId,
      followingdom: followingdomId,
      dateCreated: date,
    });
    await follow.save(); // Saves freet to MongoDB
    return follow.populate(['follower', 'followingdom']);
  }

  /**
   * Find a follow by username and domId
   *
   * @param {string} followerId - The follower's username
   * @param {string} followingdomId - The username of author of the freets
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(followerId: Types.ObjectId | string, followingdomId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({followee: followingdomId, follower: followerId});
  }

  /**
   * Get all the followers of a dom
   *
   * @param {string} followingdomId - The username of author of the freets
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the freets
   */
  static async findAllFollowers(followingdomId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({followingdom: followingdomId}).populate('dateCreated');
  }

  /**
   * Get all the dom the user is following
   *
   * @param {string} followerId 
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
   static async findAllFollowingDoms(followerId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({follower: followerId}).populate('dateCreated');
  }

  /**
   * Delete a follow with given followerId and followingdomId.
   *
   * @param {string} followerId 
   * @param {string} followingdomId - The username of author of the freets
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(followerId: Types.ObjectId | string, followingdomId: Types.ObjectId | string): Promise<boolean> {
    const result = await FollowModel.deleteOne({ followingdom: followingdomId, follower: followerId});
    return result !== null;
  }

  /**
   * Delete all the follows in a give dom
   *
   * @param {string} followingdomId - The id of dom of freets
   */
   static async deleteManybyDom(followingdomId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({followingdomId});
  }

  /**
   * Delete all the follows by the given user
   *
   * @param {string} followerId - The id of the user
   */
  static async deleteManybyUser(followerId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({followerId});
  }
}

export default FollowCollection;
