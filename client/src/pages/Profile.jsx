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
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
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
    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);

            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }
            setUserListings(data);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setShowListingsError(true);
        }
    };
    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
        } catch (error) {
            console.log(error.message);
        }
    };

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
            <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
            <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing Listings' : ''}</p>


            {userListings && userListings.length > 0 && (
                <div className='flex flex-col gap-4'>
                    <h1 className='text-center mt-7 text-2xl font-semibold'>
                        Your Listings
                    </h1>
                    {userListings.map((listing) => (
                        <div
                            key={listing._id}
                            className='border rounded-lg p-3 flex justify-between items-center gap-4'
                        >
                            <Link to={`/listing/${listing._id}`}>
                                <img
                                    src={listing.imageUrls[0]}
                                    alt='listing cover'
                                    className='h-16 w-16 object-contain'
                                />
                            </Link>
                            <Link
                                className='text-purple-700 font-semibold  hover:underline truncate flex-1'
                                to={`/listing/${listing._id}`}
                            >
                                <p>{listing.name}</p>
                            </Link>

                            <div className='flex flex-col item-center'>
                                <button
                                    onClick={() => handleListingDelete(listing._id)}
                                    className='text-red-700 uppercase'
                                >
                                    Delete
                                </button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className='text-green-700 uppercase'>Edit</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default Profile;