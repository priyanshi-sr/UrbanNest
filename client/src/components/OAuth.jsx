import {GoogleAuthProvider,getAuth, signInWithPopup} from '@firebase/auth';
import {app} from  '../firebase.js'
import {useDispatch} from 'react-redux'
import {signInSuccess} from "../redux/user/userSlice.js";
import {useNavigate} from "react-router-dom";


const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const auth = getAuth(app);
            await auth.signOut(); // Ensure user is logged out

            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: "select_account",  // Force account selection
                login_hint: "", // Ensures no default account is pre-selected
            });

            // Use redirect instead of popup if needed
            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log("Could not sign in with Google", error);
        }
    }
    return (
        <button onClick={handleGoogleClick} type="button" className="bg-purple-600 text-white p-3 rounded-lg uppercase hover:opacity-85">Continue with Google</button>
    );
};

export default OAuth;
