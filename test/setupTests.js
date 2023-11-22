const { initializeTestApp, initializeAdminApp, assertFails, assertSucceeds } = require('@firebase/testing');

const PROJECT_ID = 'user-onboarding-api';

const getFirestore = (auth) => {
  return initializeTestApp({ projectId: PROJECT_ID, auth }).firestore();
};

const getAdminFirestore = () => {
  return initializeAdminApp({ projectId: PROJECT_ID }).firestore();
};

module.exports = { getFirestore, getAdminFirestore, assertFails, assertSucceeds };
