export const notificationRules = {
  auth: {
    login: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => `Welcome, ${result.name}`
      },
      error: { isEnabled: true, popup: false, placement: 'LoginForm', duration: -1 }
    },
    logout: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => `Bye-Bye, ${result.name}. See you soon.`
      },
      error: { isEnabled: true, popup: true }
    },
    initialize: { success: { isEnabled: false }, error: { isEnabled: true, popup: true } }
  },
  blogDetails: {
    fetchById: {
      success: { isEnabled: false },
      error: { isEnabled: true, popup: false, placement: 'BlogDetails', duration: -1 }
    },
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
      error: { isEnabled: true, popup: false, placement: 'CommentForm', duration: -1 }
    },
    delete: {
      success: {
        isEnabled: true,
        popup: true,
        duration: 7000,
        getMessage: () => '💀 The blog is gone... or is it? The internet never forgets. 🤫'
      },
      error: { isEnabled: true, popup: true }
    }
  },
  blogs: {
    fetchAll: {
      success: { isEnabled: false },
      error: { isEnabled: true, popup: false, placement: 'BlogList', duration: -1 }
    },
    create: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) =>
          `Thanks, ${result.user.name}, for creating blog "${result.title}" by ${result.author}! Keep it up!`
      },
      error: { isEnabled: true, popup: false, placement: 'BlogForm', duration: -1 }
    }
  },
  users: {
    fetchAll: {
      success: { isEnabled: false },
      error: { isEnabled: true, popup: false, placement: 'Users', duration: -1 }
    },
    fetchById: {
      success: { isEnabled: false },
      error: { isEnabled: true, popup: false, placement: 'UserDetails', duration: -1 }
    }
  }
};
