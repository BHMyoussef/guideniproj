import React, { useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { 
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
    updatePassword,
    updateEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser ] = useState();
    const [ currentUserInfo, setCurrentUserInfo ] = useState();

    useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth,(user)=>{
        setCurrentUser(user); 
      });
      return unsubscribe;
    },[])

    useEffect(()=>{
      getCurrentUserInfo()
    },[currentUser])

    function SignInWith(providerName){
		switch (providerName) {
			case "Google":
				const googleProvider = new GoogleAuthProvider();
        		signInWithPopup(auth, googleProvider)
				.then((result) => {
					//get the current user
					const user = result.user;
					const docData = {
            email: user.email,
            phone: user.phoneNumber,
            rank: 'Bronze',
            rating: 0,
            totalRating: 0,
            userId: user.uid
          }
					const newDoc = doc(firestore,`users/${user.uid}`);
					setDoc(newDoc,docData)
				  }).catch((error) => {
            
				  });
				break;
			case "Facebook":
				const facebookProvider = new FacebookAuthProvider()
				signInWithPopup(auth, facebookProvider)
				.then((result) => {
					const user = result.user;
					const docData = {
                        email: user.email,
                        phone: user.phoneNumber,
                        rank: 'Bronze',
                        rating: 0,
                        totalRatings: 0,
                        userId: user.uid
                    }
					const newDoc = doc(firestore,`users/${user.uid}`);
					setDoc(newDoc,docData)
				  })
				  .catch((error) => {
						this.setState({signError:"something is wrong please try again"})
				  });
				break;
			default:
				break;
		}
	}

  function updateUserInfo(){
    getCurrentUserInfo()
  }

  async function isAdmin(){
    if(currentUserInfo){
      const docRef = doc(firestore,`admins/${currentUserInfo.userId}`);
      const result = await getDoc(docRef);
      return result.exists();
    }
  }

  function getCurrentUserInfo(){
    if(currentUser){
      const docRef = doc(firestore,`users/${currentUser.uid}`);
      getDoc(docRef)
      .then(result=>{
        setCurrentUserInfo(result.data())
      })
    }else{
      setCurrentUserInfo(null);
    }
  }

    function signOutLogin(){
        return signOut(auth);
    }  
    
    
    const value = {
        currentUser: currentUser,
        currentUserInfo:currentUserInfo,
        signOutLogin: signOutLogin,
        SignInWith: SignInWith,
        updateUserInfo,
        isAdmin,
        updatePassword,
        updateEmail
    }
    console.log(currentUserInfo)
    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
}
