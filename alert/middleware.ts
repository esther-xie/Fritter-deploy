import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import AlertCollection from '../alert/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a alert with alertId is req.params exists
 */
const isAlertExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.alertId);
  const alert = validFormat ? await AlertCollection.findOne(req.params.alertId) : '';
  if (!alert) {
    res.status(404).json({
      error: {
        alertNotFound: `Alert with alert ID ${req.params.alertId} does not exist.`
      }
    });
    return;
  }

  next();
};

//TODO
/**
 * Checks if the user has not alerted the freet
 */
 const isFreetNotAlertedbyUser = async (req: Request, res: Response, next: NextFunction) => {
  const alert = await AlertCollection.findOneByUserIdAndFreetId(req.session.userId, req.params.freetId);
  if (!alert) {
    next();
    return;
  }
  res.status(409).json({
    error: {
      username: 'You cannot alert twice.'
    }
  });
};

const isFreetAlertedbyUser = async (req: Request, res: Response, next: NextFunction) => {
  const alert = await AlertCollection.findOneByUserIdAndFreetId(req.session.userId, req.params.freetId);
  if (alert) {
    next();
    return;
  }
  res.status(409).json({
    error: {
      username: 'You have not alerted the freet.'
    }
  });
};

/**
 * Checks if the current user can modify the alert
 */
const isValidAlertModifier = async (req: Request, res: Response, next: NextFunction) => {
  const alert = await AlertCollection.findOne(req.params.alertId);
  const userId = alert.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

export {
  isAlertExists,
  isValidAlertModifier,
  isFreetNotAlertedbyUser,
  isFreetAlertedbyUser
};
