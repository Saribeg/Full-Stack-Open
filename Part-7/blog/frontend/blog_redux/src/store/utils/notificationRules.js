export const notificationRules = {
  auth: {
    login: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => `Welcome, ${result.name}`
      },
      error: { isEnabled: true, popup: false, placement: 'loginForm' }
    },
    logout: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => `Bye-Bye, ${result.name}. See you soon.`
      },
      error: { isEnabled: true, popup: true }
    },
    initialize: { success: { isEnabled: false }, error: { isEnabled: true } }
  },
  blogDetails: {
    fetchById: { success: { isEnabled: false }, error: { isEnabled: true } },
    like: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) =>
          `Thanks, ${result.user.name}, for liking "${result.title}" by ${result.author}!`
      },
      error: { isEnabled: true }
    },
    comment: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => {
          const last = result.comments.at(-1);
          return `Thanks, ${result.user.name}, for commenting "${result.title}" by ${result.author}! 💬 Comment "${last?.text ?? '...'}" added successfully!`;
        }
      },
      error: { isEnabled: true }
    },
    delete: {
      success: {
        isEnabled: true,
        popup: true,
        duration: 7000,
        getMessage: () => '💀 The blog is gone... or is it? The internet never forgets. 🤫'
      },
      error: { isEnabled: true }
    }
  },
  blogs: {
    fetchAll: { success: { isEnabled: false }, error: { isEnabled: true } },
    create: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) =>
          `Thanks, ${result.user.name}, for creating blog "${result.title}" by ${result.author}! Keep it up!`
      },
      error: { isEnabled: true }
    }
  },
  users: {
    fetchAll: { success: { isEnabled: false }, error: { isEnabled: true, popup: true } },
    fetchById: { success: { isEnabled: false }, error: { isEnabled: true, popup: true } }
  }
};
