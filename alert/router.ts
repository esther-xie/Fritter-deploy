import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import AlertCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as alertValidator from '../alert/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the alerts
 *
 * @name GET /api/alerts
 *
 * @return {AlertResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get alerts by freet ID.
 *
 * @name GET /api/alerts?freetId=freetid
 *
 * @return {AlertResponse[]} - An array of alerts created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.freet !== undefined) {
      next();
      return;
    }

    const allAlerts = await AlertCollection.findAll();
    const response = allAlerts.map(util.constructAlertResponse);
    res.status(200).json(response);
  },
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetAlerts = await AlertCollection.findAllByFreetId(req.query.author as string);
    const response = freetAlerts.map(util.constructAlertResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new alert.
 *
 * @name POST /api/alerts/:freetId
 *
 * @param {number} value - The content of the alert
 * @return {AlertResponse} - The created alert
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isUserNotFreetAuthor,
    alertValidator.isFreetNotAlertedbyUser
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const alert = await AlertCollection.addOne(userId, req.params.freetId, req.body.value);
    res.status(201).json({
      message: 'Your alert was created successfully.',
      alert: util.constructAlertResponse(alert)
    });
  }
);

/**
 * Delete a alert
 *
 * @name DELETE /api/alerts/:freetId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isUserNotFreetAuthor,
    alertValidator.isFreetAlertedbyUser
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await AlertCollection.deleteOne(userId, req.params.freetId);
    res.status(200).json({
      message: 'Your alert was deleted successfully.'
    });
  }
);

export {router as alertRouter};
