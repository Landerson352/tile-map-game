import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firestore = firebase.firestore();

const useCrud = (config) => {
  const { collection, defaultDocument = {}, filter = (ref) => ref } = config;

  const [data, fetching, error] = useCollectionData(
    filter(firestore.collection(collection)),
    {
      idField: 'id',
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const loaded = data !== undefined;

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
    error,
    loaded,
    fetching,
    remove,
  };
};

export default useCrud;
