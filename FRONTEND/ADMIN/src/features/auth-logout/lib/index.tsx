import { userStore } from '@/entities/user/model/store';

export const logoutUser = async () => {
  try {
    await userStore.logout();
  } catch (e) {
    console.error("Logout failed:", e);
  }
};
