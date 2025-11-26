import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { ConnectionStatus } from '../types';
import { APP_ID } from '../constants';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const useLiveCollection = <T>(
  collectionName: string, 
  authUser: any, 
  defaultData: T[] = []
): { data: T[]; status: ConnectionStatus } => {
  const [data, setData] = useState<T[]>(defaultData);
  const [status, setStatus] = useState<ConnectionStatus>('connecting'); 

  useEffect(() => {
    if (!db || !authUser) {
        setStatus('offline');
        return;
    }

    try {
        const colRef = collection(db, 'artifacts', APP_ID, 'public', 'data', collectionName);
        const q = query(colRef, orderBy('createdAt', 'desc'));
    
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as T[];
                setData(items); 
                setStatus('live');
            }, 
            (error) => {
                console.warn(`Live sync for ${collectionName} failed.`, error.code);
                setStatus('offline');
            }
        );
    
        return () => unsubscribe();
    } catch (e) {
        console.error("Live collection error", e);
        setStatus('offline');
    }
  }, [collectionName, authUser]);

  return { data, status };
};