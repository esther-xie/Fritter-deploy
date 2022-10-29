import type {HydratedDocument, Types} from 'mongoose';
import type {Alert} from './model';
import AlertModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore alerts
 * stored in MongoDB, including adding, finding, updating, and deleting alerts.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class AlertCollection {
  /**
   * Add a alert to the collection
   *
   * @param {string} authorId - The id of the author of the alert
   * @param {string} freetId - The id of the freet
   * @param {string} value - The id of the alert
   * @return {Promise<HydratedDocument<Alert>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string, value: number ): Promise<HydratedDocument<Alert>> {
    const date = new Date();
    const alert = new AlertModel({
      authorId,
      freetId,
      dateCreated: date,
      value,
      dateModified: date
    });
    await alert.save(); // Saves alert to MongoDB
    return alert.populate(['freetId', 'dateModified']);
  }

  /**
   * Find a alert by alertId
   *
   * @param {string} alertId - The id of the freet to find
   * @return {Promise<HydratedDocument<Alert>> | Promise<null> } - The alert with the given alertId, if any
   */
  static async findOne(alertId: Types.ObjectId | string): Promise<HydratedDocument<Alert>> {
    return AlertModel.findOne({_id: alertId}).populate(['authorId', 'freetId']);
  }

  /**
   * Find a alert by userId and freetId
   *
   * @param {string} authorId - The id of the freet to find
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Alert>> | Promise<null> } - The alert with the given alertId, if any
   */
  static async findOneByUserIdAndFreetId(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Alert>> {
     return AlertModel.findOne({authorId: authorId, freetId: freetId}).populate(['authorId', 'freetId']);
  }

  /**
   * Get all the alerts in the database
   *
   * @return {Promise<HydratedDocument<Alert>[]>} - An array of all of the alerts
   */
  static async findAll(): Promise<Array<HydratedDocument<Alert>>> {
    // Retrieves alerts and sorts them from most to least recent
    return AlertModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  // /**
  //  * Get all the alerts in by given author
  //  *
  //  * @param {string} username - The username of author of the alerts
  //  * @return {Promise<HydratedDocument<Alert>[]>} - An array of all of the alerts
  //  */
  // static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Alert>>> {
  //   const author = await UserCollection.findOneByUsername(username);
  //   return AlertModel.find({authorId: author._id}).populate('authorId');
  // }

  /**
   * Get all the alerts associated with the given freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Alert>[]>} - An array of all of the alerts
   */
     static async findAllByFreetId(freetId: string): Promise<Array<HydratedDocument<Alert>>> {
      const freet = await FreetCollection.findOne(freetId);
      return AlertModel.find({freetId: freet._id}).populate('authorId');
    }

   /**
   * Get the alert by the given author under the given freet
   *
   * @param {string} freetId - The id of the freet
   * @param {string} username - The id of the author
   * @return {Promise<HydratedDocument<Alert>[]>} - An array of all of the alerts
   */
     static async findOneByFreetIdandAuthor(freetId: string, username: string): Promise<Array<HydratedDocument<Alert>>> {
      const author = await UserCollection.findOneByUsername(username);
      const freet = await FreetCollection.findOne(freetId);
      return AlertModel.find({freetId: freet._id, authorId: author._id}).populate('dateModified');
    }

  /**
   * Withdraw a alert with given authorId and freetId.
   *
   * @param {string} freetId - The id of the freet
   * @param {string} username - The id of the author
   * @return {Promise<Boolean>} - true if the alert has been deleted, false otherwise
   */
  static async deleteOne(freetId: string, username: string): Promise<boolean> {
    const alert = await AlertModel.deleteOne({freetId, username});
    return alert !== null;
  }
}

export default AlertCollection;
