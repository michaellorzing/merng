const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../util/checkAuth');

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => {
			const { username } = checkAuth(context);

			if (body.trim === '') {
				throw new UserInputError('Empty Comment', {
					errors: {
						body: 'Comment body must not be empty',
					},
				});
			}
			const post = await Post.findById(postId);

			if (post) {
				post.comments.unshift({
					body,
					username,
					createdAt: new Date().toISOString(),
				});
				await post.save();
				return post;
			} else throw new UserInputError('Post does not exist');
		},
	},
	async deleteComment(_, { postId, commentId }, context) {
		const { username } = checkAuth(context);

		const post = await Post.findById(postId);

		if (post) {
			const commentIndex = post.comment.findInidex((c) => c.id === commentId);

			if (post.comment[commentIndex].username === username) {
				post.comments.splice(commentIndex, 1);
				await post.save();
				return post;
			} else {
				throw new AuthenticationError('Action not allowed');
			}
		} else {
			throw new UserInputError('Post not found');
		}
	},
};
