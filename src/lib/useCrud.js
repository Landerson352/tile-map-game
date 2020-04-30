import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useFirestoreConnect } from 'react-redux-firebase';
import { reduce } from 'lodash';

const useCrud = (config) => {
  const { collection, defaultDocument = {} } = config;

  const firestore = useFirestore();
  useFirestoreConnect(collection);

  const rawData = useSelector(state => {
    return state.firestore.data[collection];
  });

  const loaded = rawData !== undefined;

  const data = reduce(rawData, (sum, document, id) => {
    if (!document) return sum;

    return {
      ...sum,
      [id]: {
        id,
        ...document,
        remove: () => {
          firestore.collection(collection).doc(id).delete();
        },
      },
    };
  }, {});

  const add = (props) => {
    const newRecord = {
      ...defaultDocument,
      ...props,
    };
    return firestore.collection(collection).add(newRecord)
  };

  const remove = (id) => {
    return firestore.collection(collection).doc(id).delete();
  };

  return {
    add,
    data,
    loaded,
    remove,
  };
};

export default useCrud;
