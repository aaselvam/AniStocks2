import React from 'react';

const Results = () => {
    return (
        <div>
            <h1>Ratings</h1>
        </div>
    );
};

export default Results;

// function saveMessage(messageText) {
//     // Add a new message entry to the database.
//     return firebase.firestore().collection('messages').add({
//       name: getUserName(),
//       text: messageText,
//       profilePicUrl: getProfilePicUrl(),
//       timestamp: firebase.firestore.FieldValue.serverTimestamp()
//     }).catch(function(error) {
//       console.error('Error writing new message to database', error);
//     });
//   }