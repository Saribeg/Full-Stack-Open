const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5
  },
  author: String,
  url: {
    type: String,
    required: true,
    minlength: 10
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      text: {
        type: String,
        required: true,
        minlength: 20
      }
    }
  ]
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    if (returnedObject.comments) {
      returnedObject.comments = returnedObject.comments.map(comment => {
        const transformedComment = {
          ...comment,
          id: comment._id.toString(),
          text: comment.text
        };

        delete transformedComment._id;
        return transformedComment;
      });
    }
  }
});


module.exports = mongoose.model('Blog', blogSchema);