let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login'
    });
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup'
    });
  },
  async auth(context, payload) {
    const mode = payload.mode;
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSpPASepV21528ZQThciS7bggca4ilaUo';

    if (mode === 'signup') {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSpPASepV21528ZQThciS7bggca4ilaUo';
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.error?.message || 'Failed to authenticate. Check your login data.'
        );
        throw error;
      }
      const expiresIn=+responseData.expiresIn*1000;
      // const expiresIn = 3000; // 3 saniye
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      console.log('Setting timer for', expiresIn, 'ms');
      clearTimeout(timer);
      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId
      });
    } catch (error) {
      console.error('Auth error:', error.message);
    }
  },
  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expiresIn = +tokenExpiration - new Date().getTime();
    console.log('Token expiration in ms:', expiresIn);

    if (expiresIn < 0) {
      return;
    }

    console.log('Setting timer for', expiresIn, 'ms');
    clearTimeout(timer);
    timer = setTimeout(() => {
      context.dispatch('autoLogout');
    }, expiresIn);

    if (token && userId) {
      context.commit('setUser', {
        token: token,
        userId: userId
      });
    }
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    console.log('Clearing timer');
    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null
    });
  },
  autoLogout(context) {
    console.log('Auto logout');
    context.dispatch('logout');
    context.commit('setAutoLogout');
  }
};
