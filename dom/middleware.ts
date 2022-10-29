import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DomCollection from '../dom/collection';

/**
 * Checks if a dom with domId is req.params exists
 */
 const isDomExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.domId);
  const dom = validFormat ? await DomCollection.findOne(req.params.domId) : '';
  if (!dom) {
    res.status(404).json({
      error: {
        domNotFound: `Dom with dom ID ${req.params.domId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a dom name in req.body is already used by the user
 */
const isDomnameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const dom = await DomCollection.findOneByDomnameandUser(req.body.username, req.params.domname);

  // If the current session user wants to change the dom name to one which matches
  // the current one irrespective of the case, we should allow them to do so
  if (!dom) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      domname: 'An dom with this name already exists.'
    }
  });
};

/**
 * Checks if the dom name in req.body is valid, i.e not a stream of empty
 * spaces and not more than 50 characters
 */
const isValidDomname = (req: Request, res: Response, next: NextFunction) => {
  const {domname} = req.body as {domname: string};
  if (!domname.trim()) {
    res.status(400).json({
      error: 'Dom name cannot be empty.'
    });
    return;
  }

  if (domname.length > 50) {
    res.status(413).json({
      error: 'Freet content must be no more than 50 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the displayed name of the dom in req.body is valid, i.e not more than 50 characters
 */
 const isValidDomDisplayedname = (req: Request, res: Response, next: NextFunction) => {
  const {displayedname} = req.body as {displayedname: string};
  if (displayedname.length > 50) {
    res.status(413).json({
      error: 'Dom displayed name must be no more than 50 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the description of the dom in req.body is valid, i.e not more than 140 characters
 */
 const isValidDomDescription = (req: Request, res: Response, next: NextFunction) => {
  const {description} = req.body as {description: string};
  if (description.length > 140) {
    res.status(413).json({
      error: 'Dom description must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the owner of the dom whose domId is in req.params
 */
const isYourDom = async (req: Request, res: Response, next: NextFunction) => {
  const dom = await DomCollection.findOne(req.params.domId);
  const authorId = dom.authorId._id;
  if (req.session.authorId !== authorId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' doms.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the owner of the dom whose domId is in req.params
 */
 const isNotYourDom = async (req: Request, res: Response, next: NextFunction) => {
  const dom = await DomCollection.findOne(req.params.domId);
  const authorId = dom.authorId._id;
  if (req.session.authorId == authorId.toString()) {
    res.status(403).json({
      error: 'Cannot follow your own doms.'
    });
    return;
  }

  next();
};

export {
  isDomnameNotAlreadyInUse,
  isDomExists,
  isValidDomname,
  isValidDomDisplayedname,
  isValidDomDescription,
  isYourDom,
  isNotYourDom
};
