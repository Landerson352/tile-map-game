import firebase from 'firebase/app';
import { isEmpty } from 'lodash';
import { useCollectionData as useCollectionDataRFH } from 'react-firebase-hooks/firestore';
import 'firebase/firestore';

const createEntity = (props) => {
  const {
    collection,
    defaultDocument,
  } = props;

  const add = (props) => {
    const newRecord = {
      ...defaultDocument,
      ...props,
    };
    return firebase.firestore().collection(collection).add(newRecord);
  };

  const remove = (id) => {
    return firebase.firestore().collection(collection).doc(id).delete();
  };

  const set = (id, props, config) => {
    return firebase.firestore().collection(collection).doc(id).set(props, { merge: true, ...config });
  };

  const useCollectionData = (props = {}) => {
    const {
      applyQueries = (n) => n,
    } = props;
    const [data, fetching, error] = useCollectionDataRFH(
      applyQueries(firebase.firestore().collection(collection)),
      {
        idField: 'id',
        snapshotListenOptions: { includeMetadataChanges: true },
      }
    );

    const loaded = data !== undefined;

    return {
      data,
      fetching,
      error,
      loaded,
      isEmpty: isEmpty(data),
    };
  };

  return {
    add,
    remove,
    set,
    useCollectionData,
  };
};

export default createEntity;
