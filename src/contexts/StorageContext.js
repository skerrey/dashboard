// Description: Authentication Context for Firebase

import React, { useContext } from 'react';
import { storage } from '../firebase.config';
import { uploadBytesResumable, ref } from 'firebase/storage';

const StorageContext = React.createContext();

export function useStorage() {
  return useContext(StorageContext);
};

export default function StorageProvider({ children }) {

  // Upload files to Firebase Storage 
  const uploadFiles = (userId, fileArray, maintenanceId) => {
    fileArray.forEach((file) => {
      const storageRef = ref(storage, `/${userId}/maintenance/${maintenanceId}/maintenance-images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('Upload is complete');
        }
      );
    })
  };

  const value = {
    uploadFiles,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}
