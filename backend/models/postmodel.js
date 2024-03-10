import mongoose from 'mongoose';

const postSchema = mongoose.Schema({

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
        
    },

    movie: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true  
    },

    image: {
        type: String
    },

    likes: {
        type: [String],
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now
    },



    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            userProfilePic: {
                type: String
            },
            username: {
                type: String
            }
        }
    ]

}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;