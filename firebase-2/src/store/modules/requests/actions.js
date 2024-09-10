export default {
  async contactCoach(context, payload) {
    const newRequest = {
      coachId: payload.coachId,
      userEmail: payload.email,
      message: payload.message
    };
    const responce =await fetch(``,{
      method: 'POST',
      body:JSON.stringify(newRequest)
    });
    const responceData=await responce.json();
    if(!responce.ok){
      const error =new Error(responceData.message||"failed to send request");
      throw error;
    }
    newRequest.id=responceData.name;
    newRequest.coachId=payload.coachId;
    context.commit('addRequest', newRequest);
  },
  async fetchRequests(context) {
    const coachId = context.rootGetters.userId;
    const token=context.rootGetters.token;
    const response = await fetch(`` +
        token);
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch requests.');
      throw error;
    }

    const requests = [];

    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message
      };
      requests.push(request);
    }

    context.commit('setRequests', requests);
  }
};