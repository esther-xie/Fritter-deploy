import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Dom, PopulatedDom} from '../dom/model';

// property of the Dom type
type DomResponse = {
  _id: string;
  author: string;
  domname: string;
  displayedname: string;
  description: string;
  dateCreated: string;
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
 * Transform a raw Dom object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Dom>} dom - A dom object
 * @returns {DomResponse} - The dom object response
 */
const constructDomResponse = (dom: HydratedDocument<Dom>): DomResponse => {
  const domCopy: PopulatedDom = {
    ...dom.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = domCopy.authorId;
  delete domCopy.authorId;
  return {
    ...domCopy,
    _id: domCopy._id.toString(),
    author: username,
    domname: domCopy.domname.toString(),
    dateCreated: formatDate(dom.dateCreated),
    dateModified: formatDate(dom.dateModified)
  };
};

export {
  constructDomResponse
};
