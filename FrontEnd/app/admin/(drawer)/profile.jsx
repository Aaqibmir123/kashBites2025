import ProfileScreen from "../../../src/components/profile/ProfileScreen";
import { getAdminProfileApi, updateAdminProfileApi } from "../../../src/api/admin/adminProfile";
import { useNavigation } from "expo-router";

export default function UserProfile() {
  const navigation = useNavigation();

  return (
    <ProfileScreen
      getProfileApi={getAdminProfileApi}
      updateProfileApi={updateAdminProfileApi}
      onBack={() => navigation.openDrawer()}
    />
  );
}
