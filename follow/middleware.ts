import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';
import DomCollection from '../dom/collection';


/**
 * Checks if the user has not followed the dom
 */
const isFollowNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const domId = req.body.domId as string;
  const follower = await UserCollection.findOneByUserId(req.session.userId);
  const follow = await FollowCollection.findOne(follower.id, domId);
  if (follow) {
    res.status(409).json({
      error: 
        `You are already following the dom.`
    });
    return;
  }

  next();
};

/**
 * Checks if the user has followed the dom
 */
 const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const domId = req.body.domId as string;
  const follower = await UserCollection.findOneByUserId(req.session.userId);
  const follow = await FollowCollection.findOne(follower.id, domId);
  if (!follow) {
    res.status(409).json({
      error: 
        `You are not following the dom.`
    });
    return;
  }

  next();
};

export {
  isFollowExists,
  isFollowNotExists,
};
