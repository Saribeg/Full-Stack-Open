// All thunk-notifications are configured here centralized.
// Very convenient and helps to avoid manual execution from components.
// You can configure here any new actions.
// Notification messages, duration, placement, variant (popup or inline) and feature switch are configurable.
export const notificationRules = {
  auth: {
    login: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => `Welcome, ${result.name}! 😊`
      },
      error: { isEnabled: true, popup: false, placement: 'LoginForm', duration: -1 }
    },
    logout: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => `Bye-Bye, ${result.name}. See you soon. 👋`
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
        getMessage: (result) => `Thanks for liking "${result.title}" by ${result.author}! ❤️`
      },
      error: { isEnabled: true }
    },
    comment: {
      success: {
        isEnabled: false,
        popup: true,
        getMessage: (result) => {
          const last = result.comments.at(-1);
          return `Thanks for commenting "${result.title}" by ${result.author}! 💬 Comment "${last?.text ?? '...'}" added successfully!`;
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
          `Thanks, ${result.user.name}, for creating blog "${result.title}" by ${result.author}! Keep it up! 🏆`
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
    },
    register: {
      success: {
        isEnabled: true,
        popup: true,
        getMessage: (result) => `Welcome aboard, ${result.name}! 🎉 Your account has been created.`
      },
      error: { isEnabled: true, popup: false, placement: 'RegisterForm', duration: -1 }
    }
  }
};
