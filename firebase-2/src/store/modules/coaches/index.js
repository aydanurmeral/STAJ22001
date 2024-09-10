import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  namespaced: true,
  state() {
    return {
      lastFetch:null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Sch',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Max.Web developer",
          hourlyRate: 30
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie....',
          hourlyRate: 30
        }
      ]
    };
  },
  mutations,
  actions,
  getters
};
