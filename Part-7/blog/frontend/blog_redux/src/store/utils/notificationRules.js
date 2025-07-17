export const notificationRules = {
  auth: {
    login: {
      success: true,
      error: true,
      placement: 'loginForm',
      successMessage: (result) => `Welcome, ${result.name}`
    },
    logout: {
      success: true,
      error: true,
      successMessage: (result) => `Bye-Bye, ${result.name}. See you soon.`
    },
    initialize: { success: false, error: true }
  },
  blogDetails: {
    fetchById: { success: false, error: true },
    like: {
      success: true,
      error: true,
      popup: true,
      successMessage: (result) =>
        `Thanks, ${result.user.name}, for liking "${result.title}" by ${result.author}!`
    },
    comment: {
      success: true,
      error: true,
      popup: true,
      successMessage: (result) => {
        const last = result.comments.at(-1);
        return `Thanks, ${result.user.name}, for commenting "${result.title}" by ${result.author}! 💬 Comment "${last?.text ?? '...'}" added successfully!`;
      }
    },
    delete: {
      success: true,
      error: true,
      popup: true,
      successMessage: () => '💀 The blog is gone... or is it? The internet never forgets. 🤫'
    }
  },
  blogs: {
    fetchAll: { success: false, error: true },
    create: {
      success: true,
      error: true,
      popup: true,
      successMessage: (result) =>
        `Thanks, ${result.user.name}, for creating blog "${result.title}" by ${result.author}! Keep it up!`
    }
  },
  users: {
    fetchAll: { success: false, error: true, popup: true },
    fetchById: { success: false, error: true, popup: true }
  }
};
