
import {useSelector} from "react-redux";
const Profile = () => {

    const { currentUser } = useSelector((state) => state.user || { currentUser: null });
    return (
        <div className='p-3 mx-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <img  src={currentUser.avatar} alt="profile picture" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 ' />
                <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username'/>
                <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'/>
                <input type="password" placeholder='username' className='border p-3 rounded-lg' id='password'/>
                <button className='bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-80'>update</button>

            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Sign Out</span>
            </div>
        </div>

    );
};

export default Profile;
