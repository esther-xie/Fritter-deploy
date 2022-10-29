import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import DomCollection from '../dom/collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as domValidator from '../dom/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the doms the user is following
 *
 * @name GET /api/follows/following
 *
 * @return {FollowResponse[]} 
 * @throws {403} if the user is not logged in
 */
router.get(
  '/following',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const following = await FollowCollection.findAllFollowingDoms(user._id);
    const response = following.map(util.constructFollowResponse);

    res.status(200).json({
        message: 'Here are the doms you are following',
        following: response
    });
  }
);

/**
 * Get all the followers of the dom
 *
 * @name GET /api/follows/follower/:domId?
 *
 * @return {FollowResponse[]} 
 * @throws {403} if the user is not logged in
 */
 router.get(
  '/follower/:domId?',
  [
    domValidator.isDomExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const dom = await DomCollection.findOne(req.params.domId);
    const follower = await FollowCollection.findAllFollowers(dom._id);
    const response = follower.map(util.constructFollowResponse);

    res.status(200).json({
        message: 'Here are the followers of the dom',
        following: response
    });
  }
);

/**
 * Get all the freets of following doms.
 *
 * @name GET /api/follows/following/freets
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, domId
 * @throws {403} if the user is not logged in
 *
 */
 router.get(
  '/following/freets',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const followingdom = await FollowCollection.findAllFollowingDoms(user._id);
    const response = (await Promise.all(followingdom.map(async (follow) => {
        const dom = await DomCollection.findOne(follow.followingdom);
        return await FreetCollection.findAllByDomId(dom._id);
        })))
            .flat()
            .sort((freet1, freet2) => {
                return freet2.dateModified.getTime() - freet1.dateModified.getTime();
            })
            // .map(constructFollowResponse);

        res.status(200).json({
            message: 'Here are the freets from your following doms!',
            feed: response
        });
    }
);

/**
 * Create a new follow.
 *
 * @name POST /api/follows
 *
 * @param {string} domId - The id of the dom
 * @param {string} content - The content of the freet
 * @return {FollowResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the following dom is not valid
 * @throws {400} - If the user wants to follow his/ her own dom
 * @throws {409} - If the user has already followed the dom
 */
router.post(
  '/:domId?',
  [
    userValidator.isUserLoggedIn,
    domValidator.isDomExists,
    followValidator.isFollowNotExists,
    domValidator.isNotYourDom
  ],
  async (req: Request, res: Response) => {
    const followingdomId = req.params.domId as string;
    const domname = (await DomCollection.findOne(followingdomId)).domname;
    const followerId = req.session.userId as string;
    const follow = await FollowCollection.addOne(followerId, followingdomId);
    const response = util.constructFollowResponse(follow);

    res.status(201).json({
      message: 'Your are now following dom ${domname}!',
      follow: response
    });
  }
);

/**
 * Delete a follow
 *
 * @name DELETE /api/follows
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the following dom is not valid
 * @throws {400} - If the user wants to follow his/ her own dom
 * @throws {409} - If the user has not followed the dom
 */
router.delete(
  '/:domId',
  [
    userValidator.isUserLoggedIn,
    domValidator.isDomExists,
    followValidator.isFollowExists,
    domValidator.isNotYourDom
  ],
  async (req: Request, res: Response) => {
    const followingdomId = req.body.domId as string;
    // const domname = (await DomCollection.findOne(followingdomId)).domname;
    const followerId = req.session.userId as string;
    await FollowCollection.deleteOne(followerId, followingdomId);
    res.status(200).json({
      message: 'Your have successfully unfollowed!'
    });
  }
);


export {router as followRouter};
