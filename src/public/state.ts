const state = {
  data: {},
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
  },
};

export { state };
