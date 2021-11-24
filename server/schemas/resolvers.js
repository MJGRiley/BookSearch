const { User } = require("../models")
const { AuthenticationError } = require("apollo-server-express")
const { signToken } = require("../utils/auth")

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userInfo = await User.findOne({ _id: context?.user?._id }).select('-__v -password');
                return userInfo;
            }
            throw new AuthenticationError('You must me logged in!')
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user)
            return { token, user }
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            if (!user) {
              throw new AuthenticationError('No user found with this email address')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                );
                return updatedUser;
            };
            throw new AuthenticationError("You must be logged in. Please try again!");
        },
        removeBook: async (parent, {user, params}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $pull: { savedBooks: { bookId } } },
                  { new: true }
                );
        
                return updatedUser;
              }
        
              throw new AuthenticationError("You must be logged in. Please try again!");
        },
    },
};

module.exports = resolvers;