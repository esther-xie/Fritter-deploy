import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import DomCollection from './collection';
import FollowCollection from '../follow/collection';
import * as userValidator from '../user/middleware';
import * as domValidator from '../dom/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the doms
 *
 * @name GET /api/doms
 *
 * @return {DomResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get doms by author.
 *
 * @name GET /api/doms?authorId=id
 *
 * @return {DomResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allDoms = await DomCollection.findAll();
    const response = allDoms.map(util.constructDomResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorDoms = await DomCollection.findAllByUsername(req.query.author as string);
    const response = authorDoms.map(util.constructDomResponse);
    res.status(200).json(response);
  }
);
/**
 * Create a new dom.
 *
 * @name POST /api/doms
 *
 * @param {string} domname - dom's name
 * @param {string} displayedname - dom's displayed name
 * @return {DomResponse} - The created dom
 * @throws {403} - If the user is not logged in
 * @throws {409} - If dom's name is already taken by the user
 * @throws {400} - If dom's name is empty or a stream of empty spaces
 * / if displayed name or description is in the wrong format
 * @throws {413} - If the description is more than 140 characters long
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    domValidator.isValidDomname,
    domValidator.isDomnameNotAlreadyInUse,
    domValidator.isValidDomDisplayedname,
    domValidator.isValidDomDescription
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const dom = await DomCollection.addOne(userId, req.body.domname, req.body.displayedname, req.body.description);

    res.status(201).json({
      message: `Your dom was created successfully. You are now posting under the dom ${dom.domname}`,
      dom: util.constructDomResponse(dom)
    });
  }
);

/**
 * Update a dom profile.
 *
 * @name PUT /api/doms
 *
 * @param {string} domname - dom's name
 * @param {string} displayedname - dom's displayed name
 * @return {DomResponse} - The updated dom
 * @throws {403} - If the user is not logged in
 * @throws {409} - If dom's name is already taken by the user
 * @throws {400} - If dom's name is empty or a stream of empty spaces/ if displayed name or description is in the wrong format
 * @throws {413} - If the description is more than 140 characters long
 * 
 */
router.put(
  '/:domId?',
  [
    userValidator.isUserLoggedIn,
    domValidator.isValidDomname,
    domValidator.isDomnameNotAlreadyInUse,
    domValidator.isValidDomDescription
  ],
  async (req: Request, res: Response) => {
    const dom = await DomCollection.updateOne(req.params.domId, req.body.domname, req.body.displayedname, req.body.description);
    res.status(200).json({
      message: 'The dom profile was updated successfully.',
      dom: util.constructDomResponse(dom)
    });
  }
);

/**
 * Delete a dom.
 *
 * @name DELETE /api/doms
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the owner of
 *                 the dom
 * @throws {404} - If the domId is not valid
 */
router.delete(
  '/:domId?',
  [
    userValidator.isUserLoggedIn,
    domValidator.isDomExists,
    domValidator.isYourDom
  ],
  async (req: Request, res: Response) => {
    await DomCollection.deleteOne(req.params.domId);
    await FreetCollection.deleteManybyDom(req.params.domId);
    await FollowCollection.deleteManybyDom(req.params.domId);
    res.status(200).json({
      message: 'Your dom has been deleted successfully.'
    });
  }
);

export {router as domRouter};
