import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Dom} from './model';

// property of the Dom type
type DomResponse = {
  _id: string;
  domname: string;
  displayedname: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Dom object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Dom>} dom - A dom object
 * @returns {DomResponse} - The dom object response
 */
const constructDomResponse = (user: HydratedDocument<Dom>): DomResponse => {
  const domCopy: Dom = {
    ...dom.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...domCopy,
    _id: domCopy._id.toString(),
    dateCreated: formatDate(dom.dateCreated)
  };
};

export {
  constructDomResponse
};
