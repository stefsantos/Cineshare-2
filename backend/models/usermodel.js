import mongoose from 'mongoose';

const userSchema = mongoose.Schema({

        username: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },  

        password: {
            type: String,
            minLength: 6,
            required: true
        },

        profilepic: {
            type: String,
            default: "",

        },

        followers: {
            type: [String],
            default: []
        },

        following: {
            type: [String],
            default: []
        },

        bio: {
            type: String,
            default: ""
        },

        watchlist: {
            type: [String],
            default: []

        },

        favMovies: {
            type: [String], 
            default: [],
            maxlength: 5
        }

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;