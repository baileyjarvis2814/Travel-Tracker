const createUser = (userData) => {
  return {
    id: userData.id,
    name: userData.name,
    travelerType: userData.travelerType,
  };
};
  
export default createUser;