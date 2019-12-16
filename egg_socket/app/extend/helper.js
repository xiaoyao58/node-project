module.exports = {
    parseMsg(action, payload = {}, metadata = {}) {
      const meta = Object.assign({}, {
        timestamp: Date.now(),
      }, metadata);
  
      return {
        data: {
            action: 'exchange',  // 'deny' || 'exchange' || 'broadcast'
            payload: {},
          },
          meta:{
            timestamp: 1512116201597,
            client: 'nNx88r1c5WuHf9XuAAAB',
            target: 'nNx88r1c5WuHf9XuAAAB'
          },
      };
    },
  };