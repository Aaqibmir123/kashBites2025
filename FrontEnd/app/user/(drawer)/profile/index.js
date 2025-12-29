import ProfileScreen from "../../../../src/components/profile/ProfileScreen";
import { useNavigation } from "expo-router";

import {
  getUserProfileApi,
  updateUserProfileApi,
} from "../../../../src/api/user/userProfile";

export default function UserProfile() {
  const navigation = useNavigation();

  return (
    <ProfileScreen
      getProfileApi={getUserProfileApi}
      updateProfileApi={updateUserProfileApi}
      onBack={() => navigation.openDrawer()}
    />
  );
}
