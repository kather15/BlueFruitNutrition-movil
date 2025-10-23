import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
  try {
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Usuario guardado:', userData);
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
    console.log('✅ Usuario eliminado');
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};

export const isUserLoggedIn = async () => {
  const userData = await getUserData();
  return userData !== null && userData.id !== undefined;
};