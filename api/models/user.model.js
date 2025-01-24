import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://lh3.googleusercontent.com/a/ACg8ocK6OpDmA_autVL_UODvfxyOeFIBHaC7oP0V08FifIyZTOfArd42=s96-c"
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;