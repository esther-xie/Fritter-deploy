import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Alert, PopulatedAlert} from '../alert/model';

// Update this if you add a property to the Alert type!
type AlertResponse = {
  _id: string;
  author: string;
  freet: string;
  dateCreated: string;
  value: number;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Alert object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Alert>} alert - A alert
 * @returns {AlertResponse} - The alert object formatted for the frontend
 */
const constructAlertResponse = (alert: HydratedDocument<Alert>): AlertResponse => {
  const alertCopy: PopulatedAlert = {
    ...alert.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = alertCopy.authorId;
  const freetId = alertCopy.freetId._id.toString();
  delete alertCopy.authorId;
  return {
    ...alertCopy,
    _id: alertCopy._id.toString(),
    author: username,
    freet: freetId,
    dateCreated: formatDate(alert.dateCreated),
    dateModified: formatDate(alert.dateModified)
  };
};

export {
  constructAlertResponse
};
