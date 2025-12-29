import ProfileScreen from "../../../src/components/profile/ProfileScreen";
import { getResturantProfileApi, updateResturantProfileApi } from "../../../src/api/resturants/profile.js";
import { useNavigation } from "expo-router";

export default function RestaurantProfile() {
  const navigation = useNavigation();

  return (
    <ProfileScreen
      getProfileApi={getResturantProfileApi}
      updateProfileApi={updateResturantProfileApi}
      onBack={() => navigation.openDrawer()}
    />
  );
}
