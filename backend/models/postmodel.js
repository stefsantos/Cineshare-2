import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    movie: {
        type: String,
        required: true
    },
    movieId: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true  
    },
    imageUrl: {
        type: String,
        default: ''
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    replies: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        },
        userProfilePic: {
            type: String,
            default: ''
        },
        username: {
            type: String,
            default: ''
        }
    }]
}, {
    timestamps: true // This enables createdAt and updatedAt fields automatically
});

const Post = mongoose.model('Post', postSchema);

export default Post;
