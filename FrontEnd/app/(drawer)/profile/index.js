import ProfileScreen from "../../../src/components/profile/ProfileScreen";
import { getProfileApi, updateProfileApi } from "../../../src/api/profileApi";
import { useNavigation } from "expo-router";

export default function UserProfile() {
  const navigation = useNavigation();

  return (
    <ProfileScreen
      getProfileApi={getProfileApi}
      updateProfileApi={updateProfileApi}
      onBack={() => navigation.openDrawer()}
    />
  );
}
