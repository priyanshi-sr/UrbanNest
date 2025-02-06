import {useSelector} from "react-redux";
import {useState} from "react";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserSuccess,
    deleteUserFailure, deleteUserStart, SignOutUserStart
} from "../redux/user/userSlice.js";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";


const Profile = () => {

    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user || { currentUser: null });
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },

                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async() => {
        try {
        dispatch(SignOutUserStart())
        const res = await fetch(`/api/auth/signout`);
        const data = await res.json();
        if(data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
        }
        dispatch(deleteUserSuccess(data));

    }catch (error) {
        console.log(error);
    }
    }

    return (
        <div className='p-3 mx-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <img  src={currentUser.avatar} alt="profile picture" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 ' />
                <input type="text" placeholder='username' defaultValue={currentUser.username} onChange={handleChange} className='border p-3 rounded-lg' id='username'/>
                <input type="email" placeholder='email' defaultValue={currentUser.email}  onChange={handleChange} className='border p-3 rounded-lg' id='email'/>
                <input type="password" placeholder='password' onChange={handleChange} className='border p-3 rounded-lg' id='password'/>
                <button disabled={loading} className='bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : ' Update'}</button>
                <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
                    Create Listing
                </Link>
            </form>
            <div className='flex justify-between mt-5'>
                <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
            </div>
            <p className='text-red-700 mt-5'>{error ? error : ' '}</p>
            <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ' '}</p>
        </div>

    );
};

export default Profile;
