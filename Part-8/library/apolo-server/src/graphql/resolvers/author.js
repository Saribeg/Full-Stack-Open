module.exports = {
  bookCount: async (author, _args, { loaders }) => {
    return loaders.bookCountLoader.load(author.id);
  }
};
